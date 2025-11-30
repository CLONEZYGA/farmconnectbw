export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  image: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  total: number;
} 