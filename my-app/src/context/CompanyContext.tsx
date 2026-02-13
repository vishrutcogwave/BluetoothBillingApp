import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from "react";

/* ---------------- TYPES ---------------- */

export type CompanyInfo = {
  Company_Name: string;
  Company_code: number;
  StartYear: string;
  Address1: string;
  Address2: string;
  Phone_number: string;
  Mob_number: string;
  OwnerName: string;
  Owner_Number: number;
  Fax_number: number;
  Email_id: string;
  Tin_no: string;
  Licence_number: string | null;
  Branch_code: string;
  STDCODE: string;
  Logo: string;
};

type CompanyState = {
  companyInfo: CompanyInfo | null;
};

type CompanyAction =
  | { type: "SET_COMPANY_INFO"; payload: CompanyInfo }
  | { type: "CLEAR_COMPANY_INFO" };

interface CompanyContextValue {
  companyInfo: CompanyInfo | null;
  dispatch: React.Dispatch<CompanyAction>;
}

/* ---------------- INITIAL STATE ---------------- */

const initialCompanyState: CompanyState = {
  companyInfo: null,
};

/* ---------------- REDUCER ---------------- */

const companyReducer = (
  state: CompanyState,
  action: CompanyAction
): CompanyState => {
  switch (action.type) {
    case "SET_COMPANY_INFO":
      return { companyInfo: action.payload };

    case "CLEAR_COMPANY_INFO":
      return { companyInfo: null };

    default:
      return state;
  }
};

/* ---------------- CONTEXT ---------------- */

const CompanyContext = createContext<CompanyContextValue | undefined>(
  undefined
);

/* ---------------- PROVIDER ---------------- */

export const CompanyProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, dispatch] = useReducer(
    companyReducer,
    initialCompanyState
  );

  return (
    <CompanyContext.Provider
      value={{
        companyInfo: state.companyInfo,
        dispatch,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

/* ---------------- HOOK ---------------- */

export const useCompany = (): CompanyContextValue => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error(
      "useCompany must be used inside CompanyProvider"
    );
  }
  return context;
};
