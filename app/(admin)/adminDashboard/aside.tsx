import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CircleDollarSign, ShoppingBag, UserRound } from "lucide-react";
import { faker } from "@faker-js/faker";
import { formatISO } from "date-fns";
import { formatCurrencyNaira } from "@/lib/formatCurrency";
import "./custom-button.css";
import { checkAuth, getUserAuth } from "@/lib/auth/utils";
import Link from "next/link";
import SalesChart from "./chart";

export default async function Home() {
  await checkAuth();
  // Generate fake data using Faker.js
  const totalRevenue = faker.finance.amount({
    min: 100000,
    max: 500000,
    dec: 2,
  });
  const totalOrders = faker.number.int({ min: 1000, max: 5000 });
  const totalCustomers = faker.number.int({ min: 500, max: 2000 });

  // Generate fake graph data
  const graphData = Array.from({ length: 30 }, (_, i) => ({
    name: formatISO(faker.date.recent({ days: 30 })), // Use full ISO date strings
    sales: faker.number.int({ min: 10000, max: 50000 }),
  }));

  return (
    <div className="bg-black py-6 text-neutral-200 px-4 sm:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <p className="text-heading3-bold mb-2 sm:mb-0">Dashboard</p>
        <button className="custom-btn-1 bg-white text-sm px-4 py-2">
          <Link href={"/adminDashboards/allProducts"}>Products</Link>
        </button>
      </div>
      <Separator className="my-4 bg-neutral-700" />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        <Card className="bg-natural-900">
          <CardHeader className="flex flex-row items-center justify-between text-neutral-300">
            <CardTitle className="text-sm">Total Revenue</CardTitle>
            <CircleDollarSign className="hidden sm:block" />
          </CardHeader>
          <CardContent>
            <p className="text-body-bold text-lg">{totalRevenue}</p>
          </CardContent>
        </Card>

        <Card className="bg-natural-900">
          <CardHeader className="flex flex-row items-center justify-between text-neutral-300">
            <CardTitle className="text-sm">Total Orders</CardTitle>
            <ShoppingBag className="hidden sm:block" />
          </CardHeader>
          <CardContent>
            <p className="text-body-bold text-lg">
              {formatCurrencyNaira(totalOrders)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-natural-900">
          <CardHeader className="flex flex-row items-center justify-between text-neutral-300">
            <CardTitle className="text-sm">Total Customer</CardTitle>
            <UserRound className="hidden sm:block" />
          </CardHeader>
          <CardContent>
            <p className="text-body-bold text-lg">{totalCustomers}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-natural-900 mt-8">
        <CardHeader>
          <CardTitle className="text-sm">Sales Chart ($)</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesChart data={graphData} />
        </CardContent>
      </Card>
    </div>
  );
}
