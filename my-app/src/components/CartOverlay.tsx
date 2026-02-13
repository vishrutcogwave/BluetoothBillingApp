// import React from "react";

// interface CartItem {
//   id: number;
//   name: string;
//   price: number;
//   qty: number;
// }

// interface CartOverlayProps {
//   cartItems: CartItem[];
//   total: number;
//   onCancel: () => void;
//   onViewCart: () => void;
// }

// const CartOverlay: React.FC<CartOverlayProps> = ({
//   cartItems,
//   total,
//   onCancel,
//   onViewCart,
// }) => {
//   if (cartItems.length === 0) return null;

//   const totalQty = cartItems.reduce(
//     (sum, item) => sum + item.qty,
//     0
//   );

//   return (
//     <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg border-t border-gray-300 p-4 z-50">
//       <div className="flex flex-col sm:flex-row justify-between items-center gap-3 max-w-6xl mx-auto">
//         <div className="flex-1">
//           <p className="font-semibold text-sm sm:text-base md:text-lg">
//             {totalQty} item(s) selected | Total:  ₹{total.toFixed(2)}
//           </p>
//         </div>

//         <div className="flex gap-3 mt-2 sm:mt-0">
//           <button
//             onClick={onCancel}
//             className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
//           >
//             Cancel Order
//           </button>

//           <button
//             onClick={onViewCart}
//             className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
//           >
//             View Cart
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CartOverlay;
import React from "react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

interface CartOverlayProps {
  cartItems: CartItem[];
  total: number;
  onCancel: () => void;
  onViewCart: () => void;
}

const CartOverlay: React.FC<CartOverlayProps> = ({
  cartItems,
  total,
  onCancel,
  onViewCart,
}) => {
  if (cartItems.length === 0) return null;

  const totalQty = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg border-t border-gray-300 p-4 z-50">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 max-w-6xl mx-auto">
        <div className="flex-1">
          <p className="font-semibold text-sm sm:text-base md:text-lg">
            {totalQty} item(s) selected | Total:  ₹{total.toFixed(2)}
          </p>
        </div>

        <div className="flex gap-3 mt-2 sm:mt-0">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Cancel Order
          </button>

          <button
            onClick={onViewCart}
            className="px-4 py-2 bg-[#0576B2] text-white rounded-md hover:bg-[#0460a0] transition-colors"
          >
            View Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartOverlay;
