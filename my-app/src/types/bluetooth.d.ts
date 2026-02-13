interface Navigator {
  bluetooth: Bluetooth;
}
export interface TaxItem {
  TaxName: string;
  Taxper: number;
  TaxableAmount: number;
  TaxAmount: number;
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
