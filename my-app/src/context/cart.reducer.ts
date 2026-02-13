import type { CartAction, CartState } from "./cart.types";

export const initialCartState: CartState = {
  items: [],
};

export function cartReducer(
  state: CartState,
  action: CartAction
): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const item = state.items.find(
        (i) => i.id === action.payload.id
      );

      if (item) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id
              ? { ...i, qty: i.qty + 1 }
              : i
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, qty: 1 }],
      };
    }

    case "INCREASE_QTY":
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload ? { ...i, qty: i.qty + 1 } : i
        ),
      };

    case "DECREASE_QTY":
      return {
        ...state,
        items: state.items
          .map((i) =>
            i.id === action.payload ? { ...i, qty: i.qty - 1 } : i
          )
          .filter((i) => i.qty > 0),
      };

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (i) => i.id !== action.payload
        ),
      };

    case "CLEAR_CART":
      return {
        items: [],
      };

    default:
      return state;
  }
}
