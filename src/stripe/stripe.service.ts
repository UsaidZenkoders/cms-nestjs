import { Injectable } from '@nestjs/common';
import { Cart } from 'src/cart/entities/cart.entity';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe;
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });
  }
  // checkout(cart: Cart[]) {
  //   const totalPrice = cart.reduce(
  //     (acc, item) => acc + item.quantity * item.price,
  //     0,
  //   );
  //   return this.stripe.paymentIntents.create({
  //       amount:totalPrice,
  //       currency:'Rps',
  //       payment_method_types:['card']
  //   })
  // }
}
