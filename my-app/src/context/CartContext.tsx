import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from "react";
import { cartReducer, initialCartState } from "./cart.reducer";
import type { CartAction, CartItem } from "./cart.types";

interface CartContextValue {
  items: CartItem[];
  total: number;
  dispatch: React.Dispatch<CartAction>;
}

const CartContext = createContext<CartContextValue | undefined>(
  undefined
);

export const CartProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, dispatch] = useReducer(
    cartReducer,
    initialCartState
  );

  const total = state.items.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        total,
        dispatch,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }
  return context;
};
