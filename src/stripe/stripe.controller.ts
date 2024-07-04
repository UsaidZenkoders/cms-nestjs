import { Controller, Post } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}
//   @Post('/checkout')
//   async create() {
//     return await this.stripeService.createCheckoutSession();
//   }
}
