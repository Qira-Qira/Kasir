import { getProductsFromSupabase, getReportFromSupabase } from "../lib/supabase-data";

const waitForServer = (ms = 650) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getServerSideProps(page: "products" | "report", filters?: { range?: string; shift?: string; branch?: string; from?: string; to?: string }) {
  await waitForServer();

  if (page === "products") {
    const products = await getProductsFromSupabase();

    return {
      props: {
        products,
        fetchedAt: new Date().toISOString(),
      },
    };
  }

  const report = await getReportFromSupabase(filters ?? {});

  return {
    props: {
      report,
    },
  };
}
