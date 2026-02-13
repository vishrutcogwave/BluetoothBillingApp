import { useEffect, useState } from "react";
import { FALLBACK_IMAGE, type Category } from "../utils";
import { Route, Routes, useLocation } from "react-router-dom";
import {
  getcompanyinfobill,
  getFoodCategories,
  getFoodsImage,
  type FoodItem,
} from "../api/kotService";
import { CartProvider } from "../context/CartContext";
import CategorySidebar from "../components/CategorySidebar";
import ItemsPage from "./ItemsPage";
import CartPage from "../components/CartPage";
import FoodLoader from "../components/FoodLoader"; // import loader
import Loginpage from "./Loginpage";
import { useOutlet } from "../context/OutletContext";
import { useCompany } from "../context/CompanyContext";
import { retryRequest } from "../components/retryRequest";

export default function LandingPage() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // loader state
  const location = useLocation();
  const { selectedOutlet } = useOutlet();
  console.log(selectedOutlet, "selectedOutlet");
  const { companyInfo, dispatch } = useCompany();

  const fetchCompanyInfo = async () => {
    try {
      if (companyInfo) return;

      const res = await retryRequest(() => getcompanyinfobill());

      if (res && res.Company_Name) {
        dispatch({
          type: "SET_COMPANY_INFO",
          payload: res,
        });
      }
    } catch (err) {
      console.error("Company info fetch failed", err);
    }
  };

 const fetchCategories = async () => {
  try {
    setLoading(true);

    const data = await retryRequest(() => getFoodCategories());

    const mapped: Category[] = data.map((cat: any) => ({
      id: cat.CategoryId,
      name: cat.Category.trim(),
      image: cat.thumb || FALLBACK_IMAGE,
    }));

    // 🔥 Add ALL category at top
    // const allCategory: Category = {
    //   id: 0, // important: special id
    //   name: "ALL",
    //   image: FALLBACK_IMAGE,
    // };

    // const finalCategories = [allCategory, ...mapped];

    setCategories(mapped);

    if (mapped.length > 0)
      setActiveCategory(mapped[0].id); // default = ALL
  } catch (err) {
    console.error("Categories fetch failed", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchCategories();
    fetchCompanyInfo();
  }, []);

  // Fetch items whenever activeCategory changes
  useEffect(() => {
    if (activeCategory === null) return;

    const fetchItems = async () => {
      try {
        setLoading(true);

        const data = await retryRequest(() =>
          getFoodsImage(selectedOutlet?.id ?? 7, activeCategory),
        );

        const mappedItems: FoodItem[] = data.foodmodellist.map((item) => ({
          ...item,
          thumb: item.thumb || FALLBACK_IMAGE,
        }));

        setItems(mappedItems);
      } catch (err) {
        console.error(err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [activeCategory]);
const isLogin = location.pathname === "/" || location.pathname === "/cart";
  return (
    <CartProvider>
      <div className="min-h-screen flex bg-gray-100">
        {location.pathname !== "/cart" &&
          location.pathname !== "/" &&
          activeCategory !== null && (
            <CategorySidebar
              active={activeCategory}
              onSelect={setActiveCategory}
              categories={categories}
            />
          )}

        <main className={`flex-1 ${!isLogin ? "pt-20 md:pt-0" : ""}`}>

          <Routes>
            <Route path="/" element={<Loginpage />} />

            <Route
              path="/itemsPage"
              element={
                loading ? (
                  <FoodLoader />
                ) : (
                  <ItemsPage
                    items={items.map((item) => ({
                      id: item.ItemCode,
                      title: item.ItemName,
                      image: item.thumb || FALLBACK_IMAGE,
                      description: item.description || "",
                      price: item.CurrentPrize || item.ItemRate,
                      spicy: false,
                      catcode: item.CatCode,
                    }))}
                  />
                )
              }
            />

            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </main>
      </div>
    </CartProvider>
  );
}

