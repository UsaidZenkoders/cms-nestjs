import { Injectable, Inject } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {

  private stripe:Stripe
  constructor(
  ) {
    this.stripe = new Stripe('sk_test_51PXltD2MoZpvnciChgf4FDodHNzl54NRUKNoCzpHA99w4YSOPQlmJjnvUmUv4u4rV3ppm64QLcUJ2rzjXR2KwUf700uK4uVBJI', {
      apiVersion: '2024-06-20',
    });
  }
  async createProductPrice(course_code:string,coursePrice:number):Promise<string>{
    const price = await this.stripe.prices.create({
      currency: 'usd',
      unit_amount: coursePrice,
      product_data:{
         name:course_code
    }});
    console.log(price.id)
    return price.id
   
  }
  async createCheckoutSession(priceId:string) {
    try {
     
      const session = await this.stripe.checkout.sessions.create({
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
        
        payment_method_types: ['card'],
        line_items: [
          {
            price:priceId,
            quantity: 1,
          },
        ],
        mode: 'payment',
      });
      return session.url;
    } catch (error) {
      // Handle any errors that occur during session creation
      console.log(error)
      throw new Error(`Failed to create Stripe checkout session: ${error.message}`)
    }}}
