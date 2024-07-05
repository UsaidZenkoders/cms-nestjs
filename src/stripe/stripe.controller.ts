import { Controller,Post, RawBodyRequest,Headers,Request, Req } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}
  @Post('/webhook')
  async webhook(
    @Headers('stripe-signature') sig: string,
    @Req() req: RawBodyRequest<Request>,
  ):Promise<{recieved:boolean}> {
    console.log("Raw Body",req)
    return await this.stripeService.createWebHook(req.rawBody,sig);
  }
  @Post('/webhook_endpoint')
  async createEndpoint(
  ) {
    return await this.stripeService.createWebhookEndpoint();
  }
}
