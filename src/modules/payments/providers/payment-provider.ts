import "server-only";

import { AppError } from "@/lib/errors/app-error";

export type CreatePaymentInput = {
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  callbackUrl: string;
};

export type CreatePaymentResult = {
  transactionId: string;
  paymentUrl: string;
};

export interface PaymentProvider {
  readonly name: string;
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
}

class UnconfiguredPaymentProvider implements PaymentProvider {
  readonly name = "unconfigured";

  async createPayment(
    _input: CreatePaymentInput,
  ): Promise<CreatePaymentResult> {
    throw new AppError("درگاه پرداخت هنوز پیکربندی نشده است", 503);
  }
}

// Replace this adapter with the selected gateway when credentials are available.
export function getPaymentProvider(): PaymentProvider {
  return new UnconfiguredPaymentProvider();
}
