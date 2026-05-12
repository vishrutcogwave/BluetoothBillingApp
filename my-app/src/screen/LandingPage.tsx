import { useEffect, useState } from "react";
import { FALLBACK_IMAGE, type Category } from "../utils";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import {
  getcompanyinfobill,
  getFoodCategories,
  getFoodsImage,
  getOutletsForUser,
  type FoodItem,
} from "../api/kotService";

import { CartProvider } from "../context/CartContext";

import CategorySidebar from "../components/CategorySidebar";

import ItemsPage from "./ItemsPage";
import CartPage from "../components/CartPage";
import FoodLoader from "../components/FoodLoader";
import Loginpage from "./Loginpage";

import { useCompany } from "../context/CompanyContext";
import { retryRequest } from "../components/retryRequest";

import SalesReport from "../components/SalesReport";
import ItemSalesReport from "../components/ItemSalesReport";

interface OutletItem {
  id: number;
  name: string;
}

export default function LandingPage() {
  const [activeCategory, setActiveCategory] =
    useState<number | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);

  const [items, setItems] = useState<FoodItem[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const [outlets, setOutlets] = useState<OutletItem[]>([]);

  const [activeOutlet, setActiveOutlet] =
    useState<number | null>(null);

  const location = useLocation();

  const navigate = useNavigate();

  const { companyInfo, dispatch } = useCompany();

  // ================= FETCH OUTLETS =================
const fetchOutlets = async () => {
  try {
    const username = localStorage.getItem("username") || "";

    const data = await retryRequest(() =>
      getOutletsForUser(username)
    );

    const mapped = data.map((out: any) => ({
      id: out.OltCode,
      name: out.OltName,
    }));

    setOutlets(mapped);

    if (mapped.length > 0) {
      setActiveOutlet(mapped[0].id);
    }
  } catch (err) {
    console.error("Outlet fetch failed", err);
  }
};
  // ================= FETCH COMPANY =================
  const fetchCompanyInfo = async () => {
    try {
      if (companyInfo) return;

      const res = await retryRequest(() =>
        getcompanyinfobill()
      );

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

  // ================= FETCH CATEGORIES =================
  const fetchCategories = async () => {
    try {
      setLoading(true);

      const data = await retryRequest(() =>
        getFoodCategories()
      );

      const mapped: Category[] = data.map((cat: any) => ({
        id: cat.CategoryId,
        name: cat.Category.trim(),
        image: cat.thumb || FALLBACK_IMAGE,
      }));

      setCategories(mapped);

      if (mapped.length > 0) {
        setActiveCategory(mapped[0].id);
      }
    } catch (err) {
      console.error("Categories fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= INITIAL LOAD =================
  useEffect(() => {
    fetchOutlets();
    fetchCategories();
    fetchCompanyInfo();
  }, []);

  // ================= FETCH ITEMS =================
  useEffect(() => {
    if (
      activeCategory === null ||
      activeOutlet === null
    )
      return;

    const fetchItems = async () => {
      try {
        setLoading(true);

        const data = await retryRequest(() =>
          getFoodsImage(activeOutlet, activeCategory)
        );

        const mappedItems: FoodItem[] =
          data.foodmodellist.map((item) => ({
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
  }, [activeCategory, activeOutlet]);

  const isLogin =
    location.pathname === "/" ||
    location.pathname === "/cart" ||
    location.pathname === "/sales-report" ||
    location.pathname === "/item-sales-report";

  return (
    <CartProvider>
      <div className="min-h-screen flex bg-gray-100">
        
        {/* ================= SIDEBAR ================= */}
        {location.pathname !== "/cart" &&
          location.pathname !== "/sales-report" &&
          location.pathname !== "/item-sales-report" &&
          location.pathname !== "/" && (
            <CategorySidebar
              active={activeCategory ?? 0}
              onSelect={setActiveCategory}
              categories={categories}
              outlets={outlets}
              activeOutlet={activeOutlet}
              onSelectOutlet={setActiveOutlet}
            />
          )}

        {/* ================= MAIN ================= */}
        <main
          className={`flex-1 ${
            !isLogin ? "pt-[150px] md:pt-0" : ""
          }`}
        >
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
                      image:
                        item.thumb || FALLBACK_IMAGE,
                      description:
                        item.description || "",
                      price:
                        item.CurrentPrize ||
                        item.ItemRate,
                      spicy: false,
                      catcode: item.CatCode,
                    }))}
                  />
                )
              }
            />

            <Route
              path="/cart"
              element={<CartPage />}
            />

            <Route
              path="/sales-report"
              element={
                <SalesReport
                  onBack={() =>
                    navigate("/itemsPage")
                  }
                />
              }
            />

            <Route
              path="/item-sales-report"
              element={
                <ItemSalesReport
                  onBack={() =>
                    navigate("/itemsPage")
                  }
                />
              }
            />
          </Routes>
        </main>
      </div>
    </CartProvider>
  );
}