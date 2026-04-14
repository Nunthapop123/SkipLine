export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  name: string;
  image: string;
  sizeLabel: string;
  sweetness: number;
  basePrice: number;
  quantity: number;
  addOns: AddOn[];
  showDetails: boolean;
}
