import {
  Power,
  ShoppingBag,
  ChevronDown,
  BarChart2,
  Package,
} from "lucide-react";

import { FALLBACK_IMAGE, type Category } from "../utils";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface OutletItem {
  id: number;
  name: string;
}

interface CategorySidebarProps {
  active: number;
  onSelect: (id: number) => void;
  categories: Category[];

  outlets: OutletItem[];
  activeOutlet: number | null;
  onSelectOutlet: (id: number) => void;
}

export default function CategorySidebar({
  active,
  onSelect,
  categories,
  outlets,
  activeOutlet,
  onSelectOutlet,
}: CategorySidebarProps) {
  const { logout } = useAuth();

  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleSalesReport = () => {
    navigate("/sales-report");
    setDropdownOpen(false);
  };

  const handleItemSalesReport = () => {
    navigate("/item-sales-report");
    setDropdownOpen(false);
  };

  return (
    <>
      {/* ================= MOBILE ================= */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#0B1220]">
        
        {/* OUTLETS */}
        <div className="flex gap-2 overflow-x-auto px-3 pt-3 pb-2 scrollbar-hide">
          {outlets.map((outlet) => {
            const isActive = activeOutlet === outlet.id;

            return (
              <button
                key={outlet.id}
                onClick={() => onSelectOutlet(outlet.id)}
className={`
  w-full p-3 rounded-lg text-[15px] font-semibold text-left transition
  ${
    isActive
      ? "bg-[#0576B2] text-white"
      : "bg-white/10 text-white"
  }
`}
              >
                {outlet.name}
              </button>
            );
          })}
        </div>

        {/* CATEGORIES */}
        <div className="flex items-center px-2 pb-3">
          <div className="flex items-center gap-3 overflow-x-auto flex-1 scrollbar-hide">
            {categories.map((cat) => {
              const isActive = active === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => onSelect(cat.id)}
                  className={`
                    flex flex-col items-center justify-center
                    w-[120px]
                    h-[74px]
                    rounded-xl
                    border
                    transition-all duration-200
                    flex-shrink-0
                    px-2
                    ${
                      isActive
                        ? "bg-[#0576B2] border-blue-700"
                        : "bg-white/5 border-transparent"
                    }
                  `}
                  type="button"
                >
                  <img
                    src={cat.image || FALLBACK_IMAGE}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                    className="w-10 h-10 rounded-full object-cover"
                    alt={cat.name}
                  />

                  <span
                    className="
                      text-[12px]
                      font-semibold
                      text-center
                      truncate
                      w-full
                      mt-1
                      text-white
                    "
                  >
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* DROPDOWN */}
          <div className="relative ml-2">
            <button
              onClick={toggleDropdown}
              className="
                flex items-center justify-center
                w-10 h-10
                bg-gray-700
                rounded-xl
                hover:bg-gray-600
              "
            >
              <ChevronDown
                size={16}
                strokeWidth={2}
                className="text-white"
              />
            </button>

            {dropdownOpen && (
              <div
                className="
                  absolute right-0 mt-2 w-44
                  bg-[#0B1220]
                  border border-gray-600
                  rounded-lg
                  shadow-lg
                  z-50
                  overflow-hidden
                "
              >
                <button
                  onClick={handleSalesReport}
                  className="
                    flex items-center gap-2
                    w-full px-3 py-3
                    hover:bg-blue-600
                    text-white text-sm
                  "
                >
                  <BarChart2 size={16} />
                  Sales Report
                </button>

                <button
                  onClick={handleItemSalesReport}
                  className="
                    flex items-center gap-2
                    w-full px-3 py-3
                    hover:bg-green-600
                    text-white text-sm
                  "
                >
                  <Package size={16} />
                  Item Sales Report
                </button>

                <button
                  onClick={logout}
                  className="
                    flex items-center gap-2
                    w-full px-3 py-3
                    hover:bg-red-600
                    text-white text-sm
                  "
                >
                  <Power size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= DESKTOP ================= */}
      <aside
        className="
          hidden md:flex
          fixed
          top-0
          left-0
          bottom-0
          w-64
          bg-[#0B1220]
          text-white
          flex-col
          p-3
          overflow-y-auto
          z-40
        "
      >
        <h2 className="flex items-center gap-2 text-lg font-semibold mb-5">
          <ShoppingBag size={20} />
          Kiosk Order
        </h2>

        {/* OUTLETS */}
        <div className="space-y-2 mb-5">
          {outlets.map((outlet) => {
            const isActive = activeOutlet === outlet.id;

            return (
              <button
                key={outlet.id}
                onClick={() => onSelectOutlet(outlet.id)}
  className={`
  w-full p-3 rounded-lg text-[17px] font-semibold text-left transition
  ${
    isActive
      ? "bg-[#0576B2] text-white"
      : "bg-white/10 text-white"
  }
`}
              >
                {outlet.name}
              </button>
            );
          })}
        </div>

        {/* CATEGORIES */}
        <div className="space-y-3">
          {categories.map((cat) => {
            const isActive = active === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelect(cat.id)}
                className={`
                  flex items-center gap-3
                  p-3 w-full
                  rounded-xl
                  transition
                  ${
                    isActive
                      ? "bg-[#0576B2]"
                      : "bg-white/5 hover:bg-white/10"
                  }
                `}
              >
                <img
                  src={cat.image || FALLBACK_IMAGE}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                  className="w-10 h-10 rounded-full object-cover"
                  alt={cat.name}
                />

                <span className="text-sm font-semibold">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      <div className="hidden md:block w-64 flex-shrink-0" />
    </>
  );
}