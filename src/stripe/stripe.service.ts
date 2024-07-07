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
import { Payments } from 'src/payments/entities/payments.entity';
import { Student } from 'src/students/entities/student.entity';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
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
        metadata: {
          code,
          description,
          type,
          email,
          name,
        },
        payment_method_types: ['card'],
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
  async retrieveSession() {}
  async createWebHook(
    payload: RawBodyRequest<Request>['rawBody'],
    signature: string,
  ): Promise<{ recieved: boolean }> {
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
    // console.log(event.data);
    // console.log(event.type)
    switch (event.type) {
      case 'checkout.session.async_payment_failed':
        await this.handleAsyncPaymentFailed(event.data.object.id);
        break;
      case 'checkout.session.completed':
        console.log('SUCCEEDED', event.data.object.metadata);
        console.log(event.data.object.id);
        await this.handleAsyncPaymentSucceeded(
          event.data.object.id,
          event.data.object.metadata,
        );

      case 'checkout.session.expired':
        return await this.handleAsyncPaymentExpired(event.data.object.id);
    }
  }
  async handleAsyncPaymentFailed(
    sessionId: string,
  ): Promise<{ recieved: boolean } | { recieved: boolean }> {
    try {
      const payment = await this.paymentsRepository.findOne({
        where: { session_id: sessionId },
      });
      if (!payment) {
        throw new BadRequestException('Invalid payment ');
      }
      payment.status = PaymentStatus.failed;
      await this.paymentsRepository.save(payment);
      console.log(payment);

      return;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async handleAsyncPaymentSucceeded(
    sessionId: string,
    metaData: any,
  ): Promise<{ recieved: boolean } | { recieved: boolean }> {
    try {
      console.log('Inside payment succeeded', metaData);
      const { code, email } = metaData;
      console.log(code);
      const course = await this.courseRepository.findOne({
        where: { code: code },
      });
      const student = await this.studentRepository.findOne({
        where: { email: email },
      });
      const payment = await this.paymentsRepository.findOne({
        where: { session_id: sessionId },
      });
      console.log(payment);
      if (!payment) {
        throw new BadRequestException('Invalid payment ');
      }
      payment.status = PaymentStatus.paid;

      console.log(payment);
      await this.paymentsRepository.save(payment);
      const enrolment = this.enrolmentRepository.create({
        course_code: course,
        status: EnrolmentStatus.active,
        student_id: student,
      });
      await this.enrolmentRepository.save(enrolment);
      console.log(enrolment);

      console.log('PAYMENT', payment);
      console.log('ENROLMENT', enrolment);

      return;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async handleAsyncPaymentExpired(
    sessionId: string,
  ): Promise<{ recieved: boolean } | { recieved: boolean }> {
    try {
      const payment = await this.paymentsRepository.findOne({
        where: { session_id: sessionId },
      });
      if (!payment) {
        throw new BadRequestException('Invalid payment ');
      }
      payment.status = PaymentStatus.expired;
      await this.paymentsRepository.save(payment);
      console.log(payment);
      return;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async createWebhookEndpoint() {
    const endpoint = await this.stripe.webhookEndpoints.create({
      url: 'http://localhost:3000/stripe/webooks',
      enabled_events: [
        'checkout.session.async_payment_failed',
        'checkout.session.expired',
        'checkout.session.completed',
      ],
    });
    return endpoint;
  }
}
