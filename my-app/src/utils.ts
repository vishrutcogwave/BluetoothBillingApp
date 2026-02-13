import fallbackImage from "./assets/fallbackimage.png"

export const FALLBACK_IMAGE = fallbackImage

// src/types.ts
export interface Category {
  id: number;
  name: string;
  image: string;
}

export interface Food {
  id: number;
  Food: string;
  Price: number;
  Qty: number;
  KNQty: number;
  Branch: string;
  Outlet: number;
}

export interface CartModel {
  Branch: string;
  Outlet: number;
  Table: string;
  Pax: number;
  Mode: string;
  Food: Food[];
}

export interface BillModel {
  cart: CartModel;
  tax: any;
  BillingType: string;
  SubBillingType: string;
}
