import { Power, ShoppingBag, ChevronDown, BarChart2 } from "lucide-react";
import { FALLBACK_IMAGE, type Category } from "../utils";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface CategorySidebarProps {
  active: number;
  onSelect: (id: number) => void;
  categories: Category[];
}

export default function CategorySidebar({
  active,
  onSelect,
  categories,
}: CategorySidebarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleSalesReport = () => {
    navigate("/sales-report");
    setDropdownOpen(false);
  };

  return (
    <>
      {/* ================= MOBILE TOP BAR ================= */}
      <aside className="fixed top-0 left-0 right-0 h-20 bg-[#0B1220] text-white md:hidden z-50 flex items-center px-2">
        {/* Scrollable categories */}
        <div className="flex items-center gap-3 flex-nowrap overflow-x-auto flex-1">
          {categories.map((cat) => {
            const isActive = active === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelect(cat.id)}
                className={`
                  flex flex-col items-center justify-center
                  w-[140px] h-[70px]
                  rounded-xl border-2
                  transition-colors duration-300 ease-in-out
                  flex-shrink-0
                  ${isActive ? "bg-[#0576B2] border-blue-700" : "bg-white/5 border-transparent"}
                `}
                type="button"
              >
                <img
                  src={cat.image || FALLBACK_IMAGE}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                  className="w-12 h-12 rounded-full object-cover"
                  alt={cat.name}
                />
                <span
                  className="text-[13px] font-semibold text-center whitespace-nowrap overflow-hidden text-ellipsis w-full"
                  title={cat.name}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dropdown arrow */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex flex-col justify-center items-center p-2 bg-gray-700 rounded-xl hover:bg-gray-600"
          >
            <ChevronDown size={16} strokeWidth={2} className="text-white" />
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-[#0B1220] border border-gray-600 rounded-lg shadow-lg z-50 flex flex-col">
              <button
                onClick={handleSalesReport}
                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-blue-600 text-white rounded-t-lg"
              >
                <BarChart2 size={16} /> Sales Report
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-red-600 text-white rounded-b-lg"
              >
                <Power size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Spacer to prevent overlap */}
      <div className="h-20 md:hidden" />
      <div className="h-[164px] md:hidden" />
      <div className="h-20 md:hidden" />

      {/* ================= DESKTOP SIDEBAR (UNCHANGED) ================= */}
      <aside className="hidden md:flex fixed top-0 left-0 bottom-0 w-64 bg-[#0B1220] text-white flex-col p-3 overflow-y-auto z-40">
        <h2 className="flex items-center gap-2 text-lg font-semibold mb-5">
          <ShoppingBag size={20} /> Kiosk Order
        </h2>

        <div className="space-y-3">
          {categories.map((cat) => {
            const isActive = active === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelect(cat.id)}
                className={`
                  flex items-center gap-3 p-3 w-full rounded-xl transition
                  ${isActive ? "bg-[#0576B2]" : "bg-white/5 hover:bg-white/10"}
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
                <span className="text-sm font-semibold">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </aside>
      <div className="hidden md:block w-64 flex-shrink-0" />
    </>
  );
}
