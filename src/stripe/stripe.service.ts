import {
  Injectable,
  RawBodyRequest,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from 'src/courses/entities/course.entity';
import { Enrolment } from 'src/enrolment/entities/enrolment.entity';
import { EnrolmentStatus } from 'src/enum/enrolment-status.enum';
import { PaymentStatus } from 'src/enum/payment-status.enum';
import { MailService } from 'src/mail/mail.service';
import { Payments } from 'src/payments/entities/payments.entity';
import { Student } from 'src/students/entities/student.entity';
import Stripe from 'stripe';
import { Not, Repository } from 'typeorm';
interface MetaData {
  name: string;
  type: string;
  code: string;
  description: string;
  email: string;
}

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Payments)
    private paymentsRepository: Repository<Payments>,
    @InjectRepository(Enrolment)
    private enrolmentRepository: Repository<Enrolment>,
    @InjectRepository(Course) private courseRepository: Repository<Course>,
    @InjectRepository(Student) private studentRepository: Repository<Student>,
    private readonly mailService: MailService,
  ) {
    this.stripe = new Stripe(
      'sk_test_51PXltD2MoZpvnciChgf4FDodHNzl54NRUKNoCzpHA99w4YSOPQlmJjnvUmUv4u4rV3ppm64QLcUJ2rzjXR2KwUf700uK4uVBJI',
      {
        apiVersion: '2024-06-20',
      },
    );
  }
  async createProductPrice(
    course_code: string,
    coursePrice: number,
  ): Promise<string> {
    const price = await this.stripe.prices.create({
      currency: 'usd',
      unit_amount: coursePrice,
      product_data: {
        name: course_code,
      },
    });
    console.log(price.id);
    return price.id;
  }
  async createCheckoutSession(priceId: string, metadata: MetaData) {
    try {
      const { code, name, description, type, email } = metadata;
      console.log(code, name);
      const session = await this.stripe.checkout.sessions.create({
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
        payment_method_types: ['card'],
        metadata: { code, description, type, email, name },
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],

        mode: 'payment',
      });
      // console.log('METADATA', session);
      console.log(session.id);
      return session;
    } catch (error) {
      // Handle any errors that occur during session creation
      console.log(error);
      throw new Error(
        `Failed to create Stripe checkout session: ${error.message}`,
      );
    }
  }

  async createWebHook(
    payload: RawBodyRequest<Request>['rawBody'],
    signature: string,
  ) {
    if (!signature) {
      throw new BadRequestException('Signature not found');
    }
    const secret =
      'whsec_c1f65240ff3408540d9d01e2a04672221c9977f85fb7b8cc3c1e01fc6ff6c7e1';
    const event = this.stripe.webhooks.constructEvent(
      payload,
      signature,
      secret,
    );
    switch (event.type) {
      case 'checkout.session.completed':
        console.log(event.data.object.metadata);
        await this.handleAsyncPaymentSucceeded(
          event.data.object.id,
          event.data.object.metadata,
          event.data.object.payment_status,
        );

      default:
        console.log('default');
    }
  }

  async handleAsyncPaymentFailed(sessionId: string) {
    try {
      const payment = await this.paymentsRepository.findOne({
        where: { session_id: sessionId },
      });
      if (!payment) {
        throw new BadRequestException('Invalid payment ');
      }
      payment.status = PaymentStatus.failed;
      await this.paymentsRepository.save(payment);
    } catch (error) {
      console.log(error.message);

      throw new BadRequestException(error.message);
    }
  }

  async handleAsyncPaymentSucceeded(
    sessionId: string,
    metaData: any,
    payment_status: string,
  ) {
    try {
      console.log('Inside payment succeeded', metaData);
      console.log('Payment succeeded sessionId', sessionId);
      console.log('Payment status ', payment_status);
      const { code, email } = metaData;
      const course = await this.courseRepository.findOne({
        where: { code: code },
      });
      const student = await this.studentRepository.findOne({
        where: { email: email },
      });
      const payment = await this.paymentsRepository.findOne({
        where: { session_id: sessionId },
      });
      if (!payment) {
        throw new BadRequestException('Invalid payment ');
      }

      const alreadyPurchased = await this.enrolmentRepository.findOne({
        where: {
          course_code: course,
          student_id: student,
        },
      });
      if (alreadyPurchased) {
        throw new BadRequestException('This course is already purchased');
      }
      console.log('Handle succeeded payment', payment);
      if (payment_status === 'paid') {
        payment.status = PaymentStatus.paid;
        console.log('MetaData:', metaData);
        this.mailService.sendPurchaseCourseEmail(metaData);
        await this.paymentsRepository.save(payment);

        const remainingPayments = await this.paymentsRepository.find({
          where: {
            student_id: student,
            course_code: course,
            session_id: Not(payment.session_id),
          },
          relations: ['student_id', 'course_code'],
        });
        console.log('Remaining', remainingPayments);

        await Promise.all(
          remainingPayments.map(async (pendingPayments) => {
            pendingPayments.status = PaymentStatus.expired;
            await this.paymentsRepository.save(pendingPayments);
          }),
        );

        const enrolment = this.enrolmentRepository.create({
          course_code: course,
          status: EnrolmentStatus.active,
          student_id: student,
        });
        await this.enrolmentRepository.save(enrolment);
        console.log('Succeeded enrolment', enrolment);
        return;
      }
      payment.status = PaymentStatus.failed;
      await this.paymentsRepository.save(payment);
      console.log('failed');
    } catch (error) {
      console.log(error);
      console.log(error.message);
      throw new BadRequestException(error.message);
    }
  }

  // async handleSessionCompleted(sessionId: string) {
  //   try {
  //     console.log('SessionId', sessionId);
  //     const payment = await this.paymentsRepository.findOne({
  //       where: { session_id: sessionId },
  //     });
  //     if (!payment) {
  //       throw new BadRequestException('Invalid payment ');
  //     }
  //     payment.status = PaymentStatus.expired;
  //     await this.paymentsRepository.save(payment);
  //     console.log(payment);
  //   } catch (error) {
  //     console.log(error.message);
  //     throw new BadRequestException(error.message);
  //   }
  // }
}
