import {
  Injectable,
  Inject,
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
  async createCheckoutSession(priceId: string, metadata: any) {
    try {
      const { code, name, description, price, type, email } = metadata;
      const session = await this.stripe.checkout.sessions.create({
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
        metadata: {
          code,
          description,
          price,
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
    console.log(event.type)
    switch (event.type) {
      case 'checkout.session.async_payment_failed':
        return await this.handleAsyncPaymentFailed(event.data.object.id);

      case 'checkout.session.async_payment_succeeded':
        return await this.handleAsyncPaymentSucceeded(
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
      const { course_code, student_id } = metaData;
      const course = await this.courseRepository.findOne({
        where: { code: course_code },
      });
      const student = await this.studentRepository.findOne({
        where: { email: student_id },
      });
      const payment = await this.paymentsRepository.findOne({
        where: { session_id: sessionId },
      });
      if (!payment) {
        throw new BadRequestException('Invalid payment ');
      }
      payment.status = PaymentStatus.paid;
      const enrolment = this.enrolmentRepository.create({
        course_code: course,
        status: EnrolmentStatus.active,
        student_id: student,
      });
      await this.enrolmentRepository.save(enrolment);

      await this.paymentsRepository.save(payment);
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
