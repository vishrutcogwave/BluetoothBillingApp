


import React, { useEffect, useState } from "react";
import FoodCard from "../components/FoodCard";
import CartOverlay from "../components/CartOverlay";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getFoodsImage } from "../api/kotService";
import { FALLBACK_IMAGE } from "../utils";
import QRCode from "qrcode";
interface FoodItem {
  id: string | number;
  image: string;
  title: string;
  description: string;
  price: number;
  spicy?: boolean;
  catcode: number;
}

interface ItemsPageProps {
  items: FoodItem[];
  activeOutlet: number;
}

const ItemsPage: React.FC<ItemsPageProps> = ({
  items,
  activeOutlet,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedItems, setSearchedItems] =
    useState<FoodItem[]>(items);

  const { items: cartItems, dispatch, total } =
    useCart();

  const navigate = useNavigate();
const testLCD = async () => {
  try {
    alert("1. Test button clicked");

    if (!(window as any).cordova) {
      alert("2. Cordova not available");
      return;
    }

    alert("3. Cordova detected");

    if (!(window as any).SkposLCD) {
      alert("4. SkposLCD plugin not found");
      console.log(window);
      return;
    }

    alert("5. SkposLCD plugin found");

    const qrText = "https://google.com";

    alert("6. Generating QR");

    const dataUrl = await QRCode.toDataURL(qrText);

    alert("7. QR Generated");

    console.log(dataUrl);

    const base64 = dataUrl.replace(
      "data:image/png;base64,",
      ""
    );

    alert("8. Base64 Ready");

    (window as any).SkposLCD.showQRCode(
      base64,

      () => {
        alert("9. SUCCESS - QR sent to LCD");
      },

      (err: any) => {
        alert("10. ERROR");

        alert(JSON.stringify(err));

        console.log(err);
      }
    );
  } catch (e: any) {
    alert("11. Exception");

    alert(e.message);

    console.log(e);
  }
};
  useEffect(() => {
    const fetchSearchItems = async () => {
      try {
        // ✅ If search empty show original items
        if (!searchTerm.trim()) {
          setSearchedItems(items);
          return;
        }
const Branchcode=localStorage.getItem("branch_code") ||""
        // ✅ API SEARCH
        const data = await getFoodsImage(
          activeOutlet,
          0,
          searchTerm,
          Branchcode
        );

 const mapped = data.foodmodellist.map(
  (item: any) => ({
    id: item.ItemCode,
    title: item.ItemName,
    image:
      item.thumb &&
      item.thumb.trim() !== ""
        ? item.thumb
        : FALLBACK_IMAGE,
    description: item.description || "",
    price:
      item.CurrentPrize || item.ItemRate,
    spicy: false,
    catcode: item.CatCode,
  })
);

        setSearchedItems(mapped);
      } catch (err) {
        console.error(err);
        setSearchedItems([]);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchSearchItems();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, activeOutlet, items]);

  const getQty = (id: string | number) =>
    cartItems.find((i) => i.id === id)?.qty || 0;

  return (
    <div className="p-4 w-full max-w-full overflow-x-hidden pb-32">
      {/* Search */}
      <div className="mb-2">
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          className="
            w-full
            p-3
            border border-gray-300
            rounded-md
            focus:outline-none
            focus:ring-2
            focus:ring-[#0576B2]
            focus:border-[#0576B2]
            transition
          "
        />
      </div>

      <button
  onClick={testLCD}
  className="mb-3 bg-red-600 text-white px-4 py-2 rounded"
>
  TEST LCD
</button>

      {/* Items Grid */}
      <div
        className="
          grid gap-3
          [grid-template-columns:repeat(auto-fit,minmax(160px,1fr))]
        "
      >
        {searchedItems.map((item) => (
          <FoodCard
            key={item.id}
            image={item.image}
            title={item.title}
            description={item.description}
            price={item.price}
            spicy={item.spicy}
            quantity={getQty(item.id)}
            onAdd={() =>
              dispatch({
                type: "ADD_ITEM",
                payload: {
                  id: Number(item.id),
                  name: item.title,
                  price: item.price,
                  catcode: item.catcode,
                },
              })
            }
            onIncrement={() =>
              dispatch({
                type: "INCREASE_QTY",
                payload: Number(item.id),
              })
            }
            onDecrement={() =>
              dispatch({
                type: "DECREASE_QTY",
                payload: Number(item.id),
              })
            }
          />
        ))}

        {searchedItems.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            No items found.
          </p>
        )}
      </div>

      {/* Cart Overlay */}
      {cartItems.length > 0 && (
        <CartOverlay
          cartItems={cartItems}
          total={total}
          onCancel={() =>
            dispatch({ type: "CLEAR_CART" })
          }
          onViewCart={() => navigate("/cart")}
        />
      )}
    </div>
  );
};

export default ItemsPage;