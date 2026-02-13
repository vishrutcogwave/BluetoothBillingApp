export interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  catcode:number
}

export interface CartState {
  items: CartItem[];
}

export type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "qty"> }
  | { type: "INCREASE_QTY"; payload: number }
  | { type: "DECREASE_QTY"; payload: number }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "CLEAR_CART" }; // ✅ added
