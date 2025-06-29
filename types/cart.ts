export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  provider: string;
  quantity?: number;
  date?: string;        // scheduled date
  time?: string;        // scheduled time
  priceType?: 'hourly' | 'once'; // selected price type
  note?: string;        // additional notes
  oncePrice?: number;   // store once price
  hourlyPrice?: number; // store hourly price
}

export interface CartItemParams {
  id: string;
  title: string;
  price: number;
  image: string;
  provider: string;
  quantity?: number;
  date?: string;
  time?: string;
  priceType?: 'hourly' | 'once';
  note?: string;
  oncePrice?: number;
  hourlyPrice?: number;
}