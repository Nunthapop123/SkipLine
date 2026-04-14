export type TransactionItem = {
  id: string;
  name: string;
  image: string;
  sizeLabel: string;
  sweetness: number;
  quantity: number;
  price: number;
};

export type PaymentMethod = "card" | "promptpay" | "cash";
