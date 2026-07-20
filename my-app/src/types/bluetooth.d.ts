interface Navigator {
  bluetooth: Bluetooth;
}
export interface TaxItem {
  TaxName: string;
  Taxper: number;
  TaxableAmount: number;
  TaxAmount: number;
}

<<<<<<< HEAD
=======
export interface BillDetails {
  billno: string;
  billDate: string;
  billTime: string;
  outletName: string;
  tokenNo: string;
  orderId: string;
}
>>>>>>> ec454203c02b6f7dd392c58e7823c00b8b2f6607


export interface BillDetails {
  billno: string;
  billDate: string;
  billTime: string;
  outletName: string;
  tokenNo: string;
  orderId: string;
}
export interface BillResponse {
  TotalAmount: number;
  TotalQty: number;
  CGSTPer: number;
  CGSTAmt: number;
  SGSTPer: number;
  SGSTAmt: number;
  ServiceChargePer: number;
  ServiceCharge: number;
  GrandTotal: number;
  DiscountPer: number;
  Discount: number;
  DiscountRemarks: string | null;
  RoundOff: number;
  TaxList: TaxItem[];
}
