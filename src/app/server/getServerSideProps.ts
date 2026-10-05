import { MOCK_PRODUCTS } from "../constants";
import type { Product } from "../types";

const waitForServer = (ms = 650) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getServerSideProps(page: "products" | "report") {
  await waitForServer();

  if (page === "products") {
    const products: Product[] = MOCK_PRODUCTS.map((product) => ({ ...product }));

    return {
      props: {
        products,
        fetchedAt: new Date().toISOString(),
      },
    };
  }

  return {
    props: {
      report: {
        kpiCards: [
          { label: "Gross Sales", value: "Rp 42.500.000", change: "+12.4%" },
          { label: "Net Sales", value: "Rp 38.620.000", change: "+9.8%" },
          { label: "Total Transaksi", value: "1.248", change: "+6.3%" },
          { label: "AOV", value: "Rp 34.000", change: "+4.1%" },
        ],
        bestSellerMenu: [
          { name: "Cappuccino", qty: 142, revenue: "Rp 3.550.000" },
          { name: "Latte", qty: 126, revenue: "Rp 3.150.000" },
          { name: "Croissant", qty: 118, revenue: "Rp 2.120.000" },
          { name: "Green Tea", qty: 104, revenue: "Rp 1.560.000" },
          { name: "Sandwich", qty: 92, revenue: "Rp 2.760.000" },
        ],
        fetchedAt: new Date().toISOString(),
      },
    },
  };
}
