import type { BillDetails, BillResponse } from "../types/bluetooth";

declare const bluetoothSerial: any;

class PrinterService {
  private STORAGE_KEY = "last_printer_mac";

  /* =========================
     BLUETOOTH STATE
     ========================= */

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      bluetoothSerial.isEnabled(
        () => resolve(),
        () => bluetoothSerial.enable(resolve, reject)
      );
    });
  }

  async isConnected(): Promise<boolean> {
    return new Promise((resolve) => {
      bluetoothSerial.isConnected(
        () => resolve(true),
        () => resolve(false)
      );
    });
  }

  /* =========================
     DEVICES
     ========================= */

  async getPairedDevices(): Promise<any[]> {
    await this.initialize();
    return new Promise((resolve, reject) =>
      bluetoothSerial.list(resolve, reject)
    );
  }

  /* =========================
     CONNECTION (SAFE)
     ========================= */

  async connect(mac: string): Promise<void> {
    await this.initialize();

    const alreadyConnected = await this.isConnected();
    if (alreadyConnected) {
      // 🔥 DO NOT reconnect if native socket is alive
      return;
    }

    return new Promise((resolve, reject) => {
      bluetoothSerial.connect(
        mac,
        () => {
          localStorage.setItem(this.STORAGE_KEY, mac);
          resolve();
        },
        reject
      );
    });
  }

  async autoReconnect(): Promise<boolean> {
    const mac = localStorage.getItem(this.STORAGE_KEY);
    if (!mac) return false;

    const connected = await this.isConnected();
    if (connected) return true;

    try {
      await this.connect(mac);
      return true;
    } catch {
      return false;
    }
  }

  /* =========================
     WRITE (SAFE)
     ========================= */

  async write(bytes: Uint8Array): Promise<void> {
    const connected = await this.isConnected();
    if (!connected) {
      throw new Error("Printer not connected");
    }

    let binary = "";
    for (const b of bytes) {
      binary += String.fromCharCode(b);
    }

    return new Promise((resolve, reject) =>
      bluetoothSerial.write(binary, resolve, reject)
    );
  }


// async printBill(
//   items: any[],
//   bill: BillResponse,
//   company: any
// ) {
//   const ESC = 0x1b;
//   const bytes: number[] = [];
//   const WIDTH = 32;

//   const enc = (t: string) =>
//     Array.from(new TextEncoder().encode(t));

//   const line = "-".repeat(WIDTH);

//   const center = (t: string) =>
//     t.padStart((WIDTH + t.length) / 2).padEnd(WIDTH);

//   const row = (l: string, v: string) =>
//     `${l.padEnd(WIDTH - v.length)}${v}\n`;

//   const now = new Date();
//   const date = now.toLocaleDateString("en-GB");
//   const time = now.toLocaleTimeString("en-GB", {
//     hour: "2-digit",
//     minute: "2-digit",
//   });

//   /* ================= HEADER ================= */
//   bytes.push(ESC, 0x61, 0x01, ESC, 0x45, 0x01);

//   bytes.push(
//     ...enc(center(company?.Company_Name ?? "") + "\n")
//   );

//   bytes.push(ESC, 0x45, 0x00);

//   if (company?.Address1)
//     bytes.push(...enc(center(company.Address1) + "\n"));

//   if (company?.Address2)
//     bytes.push(...enc(center(company.Address2) + "\n"));

//   if (company?.Phone_number)
//     bytes.push(
//       ...enc(center(`PH: ${company.Phone_number}`) + "\n")
//     );

//   if (company?.Tin_no)
//     bytes.push(
//       ...enc(center(`GSTIN: ${company.Tin_no}`) + "\n")
//     );

//   bytes.push(...enc(line + "\n"));

//   /* ================= BILL INFO ================= */
//   bytes.push(ESC, 0x61, 0x00);
//   bytes.push(...enc(`Date : ${date}\n`));
//   bytes.push(...enc(`Time : ${time}\n`));
//   bytes.push(...enc(line + "\n"));

//   /* ================= ITEMS ================= */
//   bytes.push(...enc("ITEM        QTY   RATE   AMT\n"));
//   bytes.push(...enc(line + "\n"));

//   items.forEach((item) => {
//     const amt = item.price * item.qty;

//     const name = item.name.slice(0, 12).padEnd(12);
//     const qty = String(item.qty).padStart(3);
//     const rate = item.price.toFixed(2).padStart(7);
//     const total = amt.toFixed(2).padStart(7);

//     bytes.push(...enc(`${name} ${qty} ${rate} ${total}\n`));
//   });

//   bytes.push(...enc(line + "\n"));

//   /* ================= TOTALS (BACKEND) ================= */
//   bytes.push(
//     ...enc(row("Subtotal", `Rs ${bill.TotalAmount.toFixed(2)}`))
//   );

//   bill.TaxList?.forEach((tax) => {
//     bytes.push(
//       ...enc(
//         row(
//           tax.TaxName,
//           `Rs ${tax.TaxAmount.toFixed(2)}`
//         )
//       )
//     );
//   });

//   if (bill.ServiceCharge > 0) {
//     bytes.push(
//       ...enc(row("Service Charge", `Rs ${bill.ServiceCharge.toFixed(2)}`))
//     );
//   }

//   if (bill.Discount > 0) {
//     bytes.push(
//       ...enc(row("Discount", `Rs ${bill.Discount.toFixed(2)}`))
//     );
//   }

//   bytes.push(
//     ...enc(row("Round Off", `Rs ${bill.RoundOff.toFixed(2)}`))
//   );

//   bytes.push(...enc(line + "\n"));

//   /* ================= GRAND TOTAL ================= */
//   bytes.push(ESC, 0x45, 0x01);
//   bytes.push(
//     ...enc(
//       center(`GRAND TOTAL : Rs ${bill.GrandTotal.toFixed(2)}`) + "\n"
//     )
//   );
//   bytes.push(ESC, 0x45, 0x00);

//   bytes.push(...enc("\nThank You! Visit Again 🙏\n\n\n"));

//   await this.write(new Uint8Array(bytes));
// }



async printBill(
  items: any[],
  bill: BillResponse,
  company: any,
  billDetails?: BillDetails // ✅ new parameter
) {
  const ESC = 0x1b;
  const bytes: number[] = [];
  const WIDTH = 32;

  const enc = (t: string) =>
    Array.from(new TextEncoder().encode(t));

  const line = "-".repeat(WIDTH);

  const center = (t: string) =>
    t.padStart((WIDTH + t.length) / 2).padEnd(WIDTH);

  const row = (l: string, v: string) =>
    `${l.padEnd(WIDTH - v.length)}${v}\n`;

  /* ================= HEADER ================= */
  bytes.push(ESC, 0x61, 0x01, ESC, 0x45, 0x01);
  bytes.push(...enc(center(company?.Company_Name ?? "") + "\n"));
  bytes.push(ESC, 0x45, 0x00);

  if (company?.Address1) bytes.push(...enc(center(company.Address1) + "\n"));
  if (company?.Address2) bytes.push(...enc(center(company.Address2) + "\n"));
  if (company?.Phone_number)
    bytes.push(...enc(center(`PH: ${company.Phone_number}`) + "\n"));
  if (company?.Tin_no)
    bytes.push(...enc(center(`GSTIN: ${company.Tin_no}`) + "\n"));

  bytes.push(...enc(line + "\n"));

  /* ================= BILL INFO ================= */
  bytes.push(ESC, 0x61, 0x00);

  // Use billDetails parameter if available, else fallback to current date/time
 
  const billNo = billDetails?.Billno ?? "";
  const outlet = billDetails?.OutletName ?? "";
const billdate= billDetails?.BillDate??"";
const billtime= billDetails?.BillTime??"";


  if (outlet) bytes.push(...enc(center(`Outlet: ${outlet}`) + "\n"));
  if (billNo) bytes.push(...enc(`Bill No : ${billNo}\n`));
  bytes.push(...enc(`Date    : ${billdate}\n`));
  bytes.push(...enc(`Time    : ${billtime}\n`));
  bytes.push(...enc(line + "\n"));

  /* ================= ITEMS ================= */
  bytes.push(...enc("ITEM        QTY   RATE   AMT\n"));
  bytes.push(...enc(line + "\n"));

  items.forEach((item) => {
    const amt = item.price * item.qty;
    const name = item.name.slice(0, 12).padEnd(12);
    const qty = String(item.qty).padStart(3);
    const rate = item.price.toFixed(2).padStart(7);
    const total = amt.toFixed(2).padStart(7);

    bytes.push(...enc(`${name} ${qty} ${rate} ${total}\n`));
  });

  bytes.push(...enc(line + "\n"));

  /* ================= TOTALS ================= */
  bytes.push(...enc(row("Subtotal", `Rs ${bill.TotalAmount.toFixed(2)}`)));

  bill.TaxList?.forEach((tax) => {
    bytes.push(...enc(row(tax.TaxName, `Rs ${tax.TaxAmount.toFixed(2)}`)));
  });

  if (bill.ServiceCharge > 0) {
    bytes.push(...enc(row("Service Charge", `Rs ${bill.ServiceCharge.toFixed(2)}`)));
  }

  if (bill.Discount > 0) {
    bytes.push(...enc(row("Discount", `Rs ${bill.Discount.toFixed(2)}`)));
  }

  bytes.push(...enc(row("Round Off", `Rs ${bill.RoundOff.toFixed(2)}`)));
  bytes.push(...enc(line + "\n"));

  /* ================= GRAND TOTAL ================= */
  bytes.push(ESC, 0x45, 0x01);
  bytes.push(...enc(center(`GRAND TOTAL : Rs ${bill.GrandTotal.toFixed(2)}`) + "\n"));
  bytes.push(ESC, 0x45, 0x00);

  bytes.push(...enc("\nThank You! Visit Again 🙏\n\n\n"));

  await this.write(new Uint8Array(bytes));
}
async printSalesReport(params: {
  outletName: string;
  fromDate: string;
  toDate: string;
  bills: {
    BillNo: string;
    Grand: number;
  }[];
  summary: {
    Particulars: string;
    Amount: number;
  }[];
  total: number;
}) {
  const ESC = 0x1b;
  const WIDTH = 32;
  const bytes: number[] = [];

  const enc = (t: string) =>
    Array.from(new TextEncoder().encode(t));

  const line = "-".repeat(WIDTH);

  const center = (t: string) =>
    t.padStart((WIDTH + t.length) / 2).padEnd(WIDTH);

  const row = (l: string, v: string) =>
    `${l.padEnd(WIDTH - v.length)}${v}\n`;

  /* ================= HEADER ================= */
  bytes.push(ESC, 0x61, 0x01, ESC, 0x45, 0x01);

  bytes.push(
    ...enc(center("SALES REPORT") + "\n")
  );

  bytes.push(ESC, 0x45, 0x00);

  bytes.push(
    ...enc(
      center(
        `Outlet: ${params.outletName}`,
      ) + "\n",
    ),
  );

  bytes.push(...enc(line + "\n"));

  /* ================= DATE ================= */
  bytes.push(ESC, 0x61, 0x00);

  bytes.push(
    ...enc(`From : ${params.fromDate}\n`),
  );

  bytes.push(
    ...enc(`To   : ${params.toDate}\n`),
  );

  bytes.push(...enc(line + "\n"));

  /* ================= BILLS ================= */
  bytes.push(
    ...enc("BILL NO           AMT\n"),
  );

  bytes.push(...enc(line + "\n"));

  params.bills.forEach((b) => {
    const billNo = b.BillNo.padEnd(16);

    const amt = b.Grand
      .toFixed(2)
      .padStart(14);

    bytes.push(
      ...enc(`${billNo}${amt}\n`),
    );
  });

  bytes.push(...enc(line + "\n"));

  /* ================= SUMMARY ================= */
  bytes.push(
    ESC,
    0x45,
    0x01,
  );

  bytes.push(...enc("SUMMARY\n"));

  bytes.push(
    ESC,
    0x45,
    0x00,
  );

  bytes.push(...enc(line + "\n"));

  params.summary.forEach((s) => {
    bytes.push(
      ...enc(
        row(
          s.Particulars || "CARD",
          `Rs ${s.Amount.toFixed(2)}`,
        ),
      ),
    );
  });

  bytes.push(...enc(line + "\n"));

  /* ================= TOTAL ================= */
  bytes.push(
    ESC,
    0x45,
    0x01,
  );

  bytes.push(
    ...enc(
      center(
        `TOTAL : Rs ${params.total.toFixed(
          2,
        )}`,
      ) + "\n",
    ),
  );

  bytes.push(
    ESC,
    0x45,
    0x00,
  );

  bytes.push(
    ...enc("\nThank You 🙏\n\n\n"),
  );

  await this.write(
    new Uint8Array(bytes),
  );
}

async printItemSalesReport(params: {
  outletName: string;
  fromDate: string;
  toDate: string;
  items: {
    ItemName: string;
    Rate: number;
    Qty: number;
    Total: number;
  }[];
}) {
  const ESC = 0x1b;
  const WIDTH = 32;
  const bytes: number[] = [];

  const enc = (t: string) =>
    Array.from(new TextEncoder().encode(t));

  const line = "-".repeat(WIDTH);

  const center = (t: string) =>
    t.padStart((WIDTH + t.length) / 2).padEnd(WIDTH);

  const row = (
    l: string,
    v: string,
  ) =>
    `${l.padEnd(
      WIDTH - v.length,
    )}${v}\n`;

  /* ================= HEADER ================= */
  bytes.push(
    ESC,
    0x61,
    0x01,
    ESC,
    0x45,
    0x01,
  );

  bytes.push(
    ...enc(
      center(
        "ITEM SALES REPORT",
      ) + "\n",
    ),
  );

  bytes.push(
    ESC,
    0x45,
    0x00,
  );

  bytes.push(
    ...enc(
      center(
        `Outlet: ${params.outletName}`,
      ) + "\n",
    ),
  );

  bytes.push(...enc(line + "\n"));

  /* ================= DATE ================= */
  bytes.push(
    ESC,
    0x61,
    0x00,
  );

  bytes.push(
    ...enc(`From : ${params.fromDate}\n`),
  );

  bytes.push(
    ...enc(`To   : ${params.toDate}\n`),
  );

  bytes.push(...enc(line + "\n"));

  /* ================= TABLE HEADER ================= */
  bytes.push(
    ...enc(
      "ITEM          QTY    AMT\n",
    ),
  );

  bytes.push(...enc(line + "\n"));

  /* ================= ITEMS ================= */
  params.items.forEach((item) => {
    const name = item.ItemName
      .replace("\n", " ")
      .slice(0, 12)
      .padEnd(12);

    const qty = String(
      item.Qty,
    ).padStart(4);

    const total = item.Total
      .toFixed(2)
      .padStart(10);

    bytes.push(
      ...enc(
        `${name}${qty}${total}\n`,
      ),
    );
  });

  bytes.push(...enc(line + "\n"));

  /* ================= SUMMARY ================= */
  const totalQty = params.items.reduce(
    (sum, i) => sum + Number(i.Qty || 0),
    0,
  );

  const grandTotal =
    params.items.reduce(
      (sum, i) =>
        sum + Number(i.Total || 0),
      0,
    );

  bytes.push(
    ...enc(
      row(
        "TOTAL QTY",
        String(totalQty),
      ),
    ),
  );

  bytes.push(...enc(line + "\n"));

  /* ================= TOTAL ================= */
  bytes.push(
    ESC,
    0x45,
    0x01,
  );

  bytes.push(
    ...enc(
      center(
        `TOTAL : Rs ${grandTotal.toFixed(
          2,
        )}`,
      ) + "\n",
    ),
  );

  bytes.push(
    ESC,
    0x45,
    0x00,
  );

  bytes.push(
    ...enc("\nThank You 🙏\n\n\n"),
  );

  await this.write(
    new Uint8Array(bytes),
  );
}

}

export const printerService = new PrinterService();
