import {
  Controller,
  Post,
  RawBodyRequest,
  Headers,
  Request,
  Req,
  Param,
  Body,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
interface MetaData {
  name: string;
  type: string;
  code: string;
  description: string;
  email: string;
}

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}
  @Post('/webhook')
  async webhook(
    @Headers('stripe-signature') sig: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    return await this.stripeService.createWebHook(req.rawBody, sig);
  }
  @Post('/product/create')
  async createProduct(
    @Body() {code,description}
  )
    {
    return await this.stripeService.createProduct(code,description)
    }
  
  // @Post('/subscription/')
  // async createSubscription(
  
  // ) {
  //   return await this.stripeService.createSubscriptionSession()
  // }
}
