import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from "react";

/* ---------------- TYPES ---------------- */

export type Outlet = {
  id: number;
  name: string;
};

type OutletState = {
  selectedOutlet: Outlet | null;
};

type OutletAction =
  | { type: "SET_OUTLET"; payload: Outlet }
  | { type: "CLEAR_OUTLET" };

interface OutletContextValue {
  selectedOutlet: Outlet | null;
  dispatch: React.Dispatch<OutletAction>;
}

/* ---------------- INITIAL STATE ---------------- */

const initialOutletState: OutletState = {
  selectedOutlet: null,
};

/* ---------------- REDUCER ---------------- */

const outletReducer = (
  state: OutletState,
  action: OutletAction
): OutletState => {
  switch (action.type) {
    case "SET_OUTLET":
      return { selectedOutlet: action.payload };

    case "CLEAR_OUTLET":
      return { selectedOutlet: null };

    default:
      return state;
  }
};

/* ---------------- CONTEXT ---------------- */

const OutletContext = createContext<OutletContextValue | undefined>(
  undefined
);

/* ---------------- PROVIDER ---------------- */

export const OutletProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, dispatch] = useReducer(
    outletReducer,
    initialOutletState
  );

  return (
    <OutletContext.Provider
      value={{
        selectedOutlet: state.selectedOutlet,
        dispatch,
      }}
    >
      {children}
    </OutletContext.Provider>
  );
};

/* ---------------- HOOK ---------------- */

export const useOutlet = (): OutletContextValue => {
  const context = useContext(OutletContext);
  if (!context) {
    throw new Error(
      "useOutlet must be used inside OutletProvider"
    );
  }
  return context;
};
