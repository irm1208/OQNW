export type CheckoutQuoteInputKey = {
  items: Array<{
    productId: number;
    productSlug: string;
    quantity: number;
    priceGbp: number;
  }>;
  shipping: string;
  country: string;
  discountCode: string | null;
  loyaltyPointsToRedeem: number;
  redeemFreePeptide: boolean;
  referralCreditGbp: number;
  paymentCurrency: "GBP" | "EUR";
  paymentMethod: "crypto" | "wallid";
};

/**
 * The browser only treats a bank-payment quote as current when every
 * price-affecting checkout input remains identical to this key.
 */
export function createCheckoutQuoteInputKey(input: CheckoutQuoteInputKey): string {
  return JSON.stringify(input);
}