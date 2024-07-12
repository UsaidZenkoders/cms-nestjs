import {
  Injectable,
  RawBodyRequest,
  BadRequestException,
} from '@nestjs/common';
import { IntersectionType } from '@nestjs/mapped-types';
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
  stringedPrice: string;
}
// interface Customer {
//   email: string;
// }
// interface Item {
//   code: string;
//   priceId: string;
// }

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
  // async createCustomer({ email }: Customer) {
  //   const customer = await this.stripe.customers.create({
  //     email,
  //   });
  //   return customer;
  // }
  async createProduct(code: string, coursePrice: number) {
    const price = await this.createProductPrice(code, coursePrice);
    const product = await this.stripe.products.create({
      name: 'Premium Plan',
      metadata: {
        code,
      },
    });
    return product;
  }

  async createProductPrice(
    course_code: string,
    coursePrice: number,
  ): Promise<Stripe.Price> {
    const price = await this.stripe.prices.create({
      currency: 'usd',
      unit_amount: coursePrice,
      product_data: {
        name: course_code,
      },
    });
    return price;
  }
  // async createSubscriptionPlan(customerId: string, { priceId, code }: Item) {
  //   try {
  //     const subscription = await this.stripe.subscriptions.create({
  //       customer: customerId,
  //       items: [
  //         {
  //           price: priceId,
  //           metadata: { code },
  //         },
  //       ],
  //     });
  //     console.log('Subscription created:', subscription);
  //     return subscription;
  //   } catch (error) {
  //     console.error('Error creating subscription:', error);
  //     throw error;
  //   }
  // }

  async createCheckoutSession(priceId: string, metadata: MetaData) {
    try {
      const { code, name, description, type, email ,stringedPrice} = metadata;
      console.log(code, name);
      const session = await this.stripe.checkout.sessions.create({
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],

        payment_intent_data: {
          metadata: { code, description, type, email, name, stringedPrice },
        },

        mode: 'payment',
      });
      return session;
    } catch (error) {
      console.log(error);
      throw new Error(
        `Failed to create Stripe checkout session: ${error.message}`,
      );
    }
  }
  async createSubscriptionSession(metadata:any) {
    const prod = await this.stripe.products.retrieve('prod_QSfakQ3K6wRnyU');
    const price = await this.stripe.prices.retrieve(
      prod.default_price.toString(),
    );
    const { code, name, description, type, email ,stringedPrice} = metadata;

    const session = await this.stripe.checkout.sessions.create({
      success_url: 'http://localhost:3000/api/',
      line_items: [
        {
          price: price.id,
          quantity: 2,
        },
      ],
      mode: 'subscription',
      metadata: {
        eventType: 'BUY COURSE',
      },
      subscription_data: {
        metadata: { code, description, type, email, name, stringedPrice },
      },
      
    });
    return {
      message: 'Visit Url for subscription',
      url: session.url,
    };
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
    console.log(event.type);
    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('Meta data on', event.data.object.metadata);
        await this.handleAsyncPaymentSucceeded(
          event.data.object.id,
          event.data.object.metadata,
        );
        break;
      case 'payment_intent.created':
        await this.handleAsyncPaymentCreated(
          event.data.object.id,
          event.data.object.metadata,
        );
        break;
      case 'payment_intent.payment_failed':
        await this.handleAsyncPaymentFailed(event.data.object.id);
        break;
      case 'customer.subscription.created':
        console.log('SUBSCRIPTION EVENT',event.data.object as Stripe.Subscription);

      default:
        console.log('default');
    }
  }

  async handleAsyncPaymentSucceeded(intent_id: string, metaData: any) {
    try {
      const { code, email } = metaData;
      console.log(intent_id);
      const course = await this.courseRepository.findOne({
        where: { code: code },
      });
      const student = await this.studentRepository.findOne({
        where: { email: email },
      });
      setTimeout(async () => {
        const payment = await this.paymentsRepository.findOne({
          where: { intent_id },
        });
        if (!payment) {
          throw new BadRequestException('Invalid payment ');
        }
        payment.status = PaymentStatus.paid;
        console.log('MetaData:', metaData);
        this.mailService.sendPurchaseCourseEmail(metaData);
        await this.paymentsRepository.save(payment);
      }, 2000);

      const enrolment = this.enrolmentRepository.create({
        course_code: course,
        status: EnrolmentStatus.active,
        student_id: student,
      });
      await this.enrolmentRepository.save(enrolment);
      console.log('Succeeded enrolment', enrolment);
      return;
    } catch (error) {
      console.log(error.message);
      throw new BadRequestException(error.message);
    }
  }

  async handleAsyncPaymentFailed(intentId: string) {
    try {
      console.log('Intent Id', intentId);
      setTimeout(async () => {
        const payment = await this.paymentsRepository.findOne({
          where: { intent_id: intentId },
        });
        if (!payment) {
          throw new BadRequestException('Invalid payment ');
        }
        payment.status = PaymentStatus.failed;
        await this.paymentsRepository.save(payment);
      }, 2000);
    } catch (error) {
      console.log(error.message);
      throw new BadRequestException(error.message);
    }
  }
  async handleAsyncPaymentCreated(intentId: string, metaData: any) {
    const { code, email, stringedPrice } = metaData;
    console.log('Created', metaData);
    const course = await this.courseRepository.findOne({
      where: { code: code },
    });
    const student = await this.studentRepository.findOne({
      where: { email: email },
    });
    const payment = this.paymentsRepository.create({
      amount: parseInt(stringedPrice),
      course_code: course,
      intent_id: intentId,
      student_id: student,
      status: PaymentStatus.pending,
    });
    await this.paymentsRepository.save(payment);
  }
}
