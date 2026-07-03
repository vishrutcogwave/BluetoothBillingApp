import axiosInstance from "./axios";

export interface Cart {
  id: number;
  name: string;
  quantity: number;
  price: number;
}
export interface FoodItem {
  ItemCode: number;
  ItemName: string;
  ItemRate: number;
  CatCode: number;
  Qty: number;
  thumb: string | null;
  Avaliable: boolean;
  description: string | null;
  CurrentPrize: number;
  VATPER: number;
  Rating: number;
  IsVeg: boolean;
  Category: string;
}
export interface Outlet {
  id: number;
  name: string;
}

export interface FoodResponse {
  foodmodellists: any | null;
  foodmodellist: FoodItem[];
  isopen: {
    Id: number;
    Date: string;
    IsOpen: boolean;
    Message: string;
  };
}
export interface BillFood {
  Id: number;
  Food: string;
  code: string;
  Price: number;
  Qty: number;
  Comment: string;
  Category: number;
  OrigQty: number;
}

export interface BillPayload {
  UserCode: number;
  Table: string;
  SubTable: string;
  Outlet: number;
  OutletName: string;
  Waiter: number;
  WaiterName: string;
  Pax: number;
  Food: BillFood[];
  Total: number;
  TotQty: number;
  Branch: string;
  Type: string;
  NCCode: number;
  NCRemarks: string;
  Discount: number;
  DiscountType: string;
  DiscountRemarks: string;
  VRemarks: string;
  Mode: string;
  SubBillType: string;
  Plan: string;
  GuestName: string;
  GuestCode: string;
  CheckInNo: string;
  KotMobileNo: string;
}


// 📂 Food APIs
export const getFoodCategories = async (
  branchCode: string
): Promise<any> => {
  const response = await axiosInstance.get("/api/kot/getfoodcategories", {
    params: {
      Branchcode: branchCode,
    },
  });

  return response.data;
};
export const getFoodsImage = async (
  outletCode: number ,
  categoryId: number,
  filter: string = "0",
  Branchcode:string 
): Promise<FoodResponse> => {
  const response = await axiosInstance.get("/api/kot/getfoodsimage", {
    params: { outlet: outletCode, category: categoryId, filter ,Branchcode},
  });
  return response.data;
};
// 📦 Billing APIs

export const getBill = async (bill: BillPayload): Promise<any> => {
  const response = await axiosInstance.post("/api/kot/KotGetBill", bill);
  return response.data;
};
export const getCardTypes = async (): Promise<any> => {
  const response = await axiosInstance.get("/api/kot/getcards");
  return response.data;
};
export const getonlineTypes = async (): Promise<any> => {
  const response = await axiosInstance.get("/api/kot/getonline");
  return response.data;
};

export const getChanceSheetReport = async (
  fromdate: string,
  todate: string,
  outlet: string,
  branchcode:string
): Promise<any> => {
  const response = await axiosInstance.get(
    "/api/POSReports/Chancesheet",
    {
      params: {
        fromdate,
        todate,
        outlet,
        branchcode
      },
    }
  );

  return response.data;
};


export const getItemSalesReport = async (
  fromdate: string,
  todate: string,
  outlet: string,
): Promise<any> => {
  const response = await axiosInstance.get(
    "/api/POSReports/Itemsales",
    {
      params: {
        fromdate,
        todate,
        outlet,
      },
    }
  );

  return response.data;
};


export const submitBill = async (bill: any): Promise<any> => {
  const response = await axiosInstance.post(
    "/api/KOT/submitOrderdirectbillnew",
    bill,
  );
  return response.data;
};
// 👤 User APIs
export const getUserDetails = async (
  username: string,
  password: string,
): Promise<any> => {
  const response = await axiosInstance.get("/api/kot/getuserdetails", {
    params: { username, password },
  });
  return response.data;
};

export const getOutlets = async (): Promise<any[]> => {
  const response = await axiosInstance.get("/api/kot/getoutlets");
  return response.data;
};

export const getcompanyinfobill = async (): Promise<any> => {
  const response = await axiosInstance.get("/api/kot/getcompanyinfobill");
  return response.data;
};
export const getBranch = async (): Promise<any> => {
  const response = await axiosInstance.get("/api/KOT/GetBranch");
  return response.data;
};
export const getbillnouseorderid = async (transactionId: any,Oltcode:number,Branchcode:string): Promise<any> => {
  const response = await axiosInstance.get("/api/kot/getbillnouseorderid", {
    params: {
      OrderId: transactionId,
      Oltcode:Oltcode,
      Branchcode:Branchcode
    }
  });
  return response.data;
};

// 💳 Payment APIs
export const sendPaymentRequest = async (
  amount: number,
  transno: string,
): Promise<any> => {
  const response = await axiosInstance.post(
    "/api/PhonePeDQRDevice/SendPaymentRequestOwnDevice",
    {},
    {
      params: { Amount: amount, Transno: transno },
    },
  );
  return response.data;
};

export const checkPaymentStatus = async (transno: string): Promise<any> => {
  const response = await axiosInstance.get("/api/PhonePeDQRDevice/CheckOwnDevicePaymentStatus", {
    params: { transno },
  });
  return response.data;
};
export const getOutletsForUser = async (
  username: string
): Promise<any> => {
  const response = await axiosInstance.get(
    "/api/kot/getoutletsforuser",
    {
      params: {
        username,
      },
    }
  );

  return response.data;
};


export const getOnlinePaymentTypes = async (): Promise<any> => {
  const response = await axiosInstance.get(
    "/api/kot/OnlinePaymentType"
  );

  return response.data;
};


export const getPaymentModeMaster = async (branchCode: string) => {
  const response = await axiosInstance.get(
    "/api/POS/GetPaymentModeMaster",
    {
      params: {
        branchcode: branchCode,
      },
    }
  );

  return response.data;
};









