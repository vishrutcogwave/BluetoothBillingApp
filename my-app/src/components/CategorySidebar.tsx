// import { ShoppingBag } from "lucide-react";
// import { FALLBACK_IMAGE, type Category } from "../utils";

// interface CategorySidebarProps {
//   active: number;
//   onSelect: (id: number) => void;
//   categories: Category[];
// }

// export default function CategorySidebar({
//   active,
//   onSelect,
//   categories,
// }: CategorySidebarProps) {
//   console.log("categories",categories);

//   return (
//     <>
//       {/* ================= MOBILE TOP BAR ================= */}
//      <aside className="fixed top-0 left-0 right-0 h-20 bg-[#0B1220] text-white md:hidden z-50 overflow-x-auto overflow-y-hidden">
//   <div className="flex h-full items-center px-2">
//     <div className="flex items-center gap-3 flex-nowrap min-w-max">
//       {categories.map((cat) => {
//         const isActive = active === cat.id;

//         return (
//           <button
//             key={cat.id}
//             onClick={() => onSelect(cat.id)}
//             className={`
//               flex flex-col items-center justify-center
//               w-[140px] h-[120px]
//               rounded-xl transition
//               flex-shrink-0
//               ${isActive ? "bg-[#0576B2]" : "bg-white/5"}
//             `}
//           >
//             <img
//               src={cat.image || FALLBACK_IMAGE}
//               onError={(e) => {
//                 e.currentTarget.onerror = null;
//                 e.currentTarget.src = FALLBACK_IMAGE;
//               }}
//               className="w-12 h-12 rounded-full object-cover"
//               alt={cat.name}
//             />
//            <span
//   className="
//     text-[13px] font-semibold text-center
//     whitespace-nowrap
//     overflow-hidden
//     text-ellipsis
//     w-full
//   "
//   title={cat.name}
// >
//   {cat.name}
// </span>

//           </button>
//         );
//       })}

//     </div>
//   </div>
// </aside>

//       {/* ✅ Spacer to prevent overlap */}
//       <div className="h-20 md:hidden" />

//       {/* ================= DESKTOP SIDEBAR (UNCHANGED) ================= */}
//       <aside className="hidden md:flex fixed top-0 left-0 bottom-0 w-64 bg-[#0B1220] text-white flex-col p-3 overflow-y-auto z-40">
//         <h2 className="flex items-center gap-2 text-lg font-semibold mb-5">
//           <ShoppingBag size={20} /> Kiosk Order
//         </h2>

//         <div className="space-y-3">
//           {categories.map((cat) => {
//             const isActive = active === cat.id;

//             return (
//               <button
//                 key={cat.id}
//                 onClick={() => onSelect(cat.id)}
//                 className={`
//                   flex items-center gap-3 p-3 w-full rounded-xl transition
//                   ${isActive ? "bg-[#0576B2]" : "bg-white/5 hover:bg-white/10"}
//                 `}
//               >
//                 <img
//                   src={cat.image || FALLBACK_IMAGE}
//                   onError={(e) => {
//                     e.currentTarget.onerror = null;
//                     e.currentTarget.src = FALLBACK_IMAGE;
//                   }}
//                   className="w-10 h-10 rounded-full object-cover"
//                   alt={cat.name}
//                 />
//                 <span className="text-sm font-semibold">
//                   {cat.name}
//                 </span>
//               </button>
//             );
//           })}
//         </div>
//       </aside>

//       <div className="hidden md:block w-64 flex-shrink-0" />
//     </>
//   );
// }

import { Power, ShoppingBag } from "lucide-react";
import { FALLBACK_IMAGE, type Category } from "../utils";
import { useAuth } from "../context/AuthContext";

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
  console.log("categories", categories);
const {logout}= useAuth() 
  return (
    <>
      {/* ================= MOBILE TOP BAR ================= */}
      {/* ================= MOBILE TOP BAR ================= */}
      {/* ================= MOBILE TOP BAR ================= */}
      <aside className="fixed top-0 left-0 right-0 h-20 bg-[#0B1220] text-white md:hidden z-50 flex items-center px-2">
        {/* Scrollable categories, taking all space except the logout button */}
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
  rounded-xl
  border-2
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
                  className="
      text-[13px] font-semibold text-center
      whitespace-nowrap overflow-hidden text-ellipsis w-full
    "
                  title={cat.name}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>

        <div
      
          onClick={logout}
          className=" flex flex-col justify-center items-center p-2 bg-red-500 rounded-xl hover:bg-gray-300"
        >
          <Power size={16} strokeWidth={2} className="text-white" />
         <span>logout</span> 
        </div>
      </aside>
      {/* Spacer to prevent overlap with page content */}
      <div className="h-20 md:hidden" />
      {/* Spacer to prevent overlap with page content */}
      <div className="h-[164px] md:hidden" />{" "}
      {/* 120px categories + 44px logout */}
      {/* ✅ Spacer to prevent overlap */}
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
