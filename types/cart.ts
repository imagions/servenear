export interface CartItem {
  id: string;
  serviceId: string;
  date: string;
  time: string;
  price: number;
}

export interface CartItemParams {
  serviceId: string;
  date: string;
  time: string;
  price: number;
}