"use client";
import { SearchCheck, User2Icon } from "lucide-react";
import { SignOutButton, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import {
  FaHome,
  FaBookmark,
  FaEnvelope,
  FaChevronDown,
  FaSignOutAlt,
  FaChartArea,
  FaMoneyBillWave,
  FaUserShield,
} from "react-icons/fa";
import { useWindowSize } from "@uidotdev/usehooks";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useSidebarStore from "@/lib/zuustand-store";

const Sidebar: React.FC = () => {
  const { signOut } = useClerk();
  const router = useRouter();

  const {
    isOpen,
    isDropdownOpen,
    isWithdrawDropdownOpen,
    toggleDropdown,
    toggleWithdrawDropdown,
    toggleSidebar,
    setDropdownOpen,
    setWithdrawDropdownOpen,
  } = useSidebarStore();
  const { width } = useWindowSize();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.includes("/allInvestments")) {
      setDropdownOpen(true);
    } else {
      setDropdownOpen(false);
    }

    if (pathname.includes("/allWithdrawal")) {
      setWithdrawDropdownOpen(true);
    } else {
      setWithdrawDropdownOpen(false);
    }
  }, [pathname, setDropdownOpen, setWithdrawDropdownOpen]);
  useEffect(() => {
    if (isOpen) {
      toggleSidebar();
    }
  }, [pathname]);
  const isSidebarVisible = isOpen || (width !== null && width >= 786);

  const isActive = (path: string) => {
    if (path === "/adminDashboard") {
      return pathname === "/adminDashboard" ? "bg-orange-500" : "";
    }
    return pathname.includes(path) ? "bg-orange-500" : "";
  };
  
 const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <>
      <AnimatePresence>
        {isSidebarVisible && width! < 786 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 z-30 pointer-events-none"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {width! < 786 ? (
        <Sheet open={isOpen} onOpenChange={toggleSidebar}>
          <SheetTrigger asChild>
            <button className="fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-md">
              Open Menu
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-neutral-950 p-4">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="text-gray-100 top-8 text-xl absolute inset-0 overflow-y-auto scrollbar-none flex flex-col gap-4
[-ms-overflow-style:'none'] 
[scrollbar-width:'none'] 
[&::-webkit-scrollbar]:hidden">
              <div className="p-2.5 mt-1 flex items-center rounded-md">
                <User2Icon className="px-2 py-1 bg-blue-600 rounded-md" />
                <h1 className="text-[15px] ml-3 text-xl text-gray-200 font-bold">
                  Admins
                </h1>
              </div>
              <hr className="my-2 text-gray-600" />

              <div>
                <Link
                  href={"/adminDashboard"}
                  className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                    "/adminDashboard"
                  )}`}
                >
                  <FaHome />
                  <span className="text-[15px] ml-4 text-gray-200">
                    Dashboard
                  </span>
                </Link>

                <Link
              href={"/adminDashboard/allInvestments"}
              className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                "/adminDashboard/allInvestments"
              )}`}
            >
              <FaChartArea />
              <span className="text-[15px] ml-4 text-gray-200">
                All Investments
              </span>
            </Link>

            <Link
              href={"/adminDashboard/payinvestment"}
              className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                "/adminDashboard/payinvestment"
              )}`}
            >
              <FaMoneyBillWave />
              <span className="text-[15px] ml-4 text-gray-200">
                Pay Investment
              </span>
            </Link>

            <Link
              href={"/adminDashboard/allWithdrawal"}
              className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                "/adminDashboard/allWithdrawal"
              )}`}
            >
              <FaMoneyBillWave />
              <span className="text-[15px] ml-4 text-gray-200">
                All Withdrawals
              </span>
            </Link>
            <Link
              href={"/adminDashboard/create-copy-trades"}
              className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                "/adminDashboard/create-copy-trades"
              )}`}
            >
              <FaBookmark />
              <span className="text-[15px] ml-4 text-gray-200">Copy Trades</span>
            </Link>
            <Link
              href={"/adminDashboard/purchase-signal"}
              className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                "/adminDashboard/purchase-signal"
              )}`}
            >
              <FaBookmark />
              <span className="text-[15px] ml-4 text-gray-200">Purchase Signal</span>
            </Link>
            <Link
              href={"/adminDashboard/allUsers"}
              className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                "/adminDashboard/allUsers"
              )}`}
            >
              <FaBookmark />
              <span className="text-[15px] ml-4 text-gray-200">All Users</span>
            </Link>
            <Link
                  href={"/adminDashboard/signal-purchases"}
                  className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                    "/adminDashboard/signal-purchases"
                  )}`}
                >
                  <FaBookmark />
                  <span className="text-[15px] ml-4 text-gray-200">
                    Purchase Signals
                  </span>
                </Link>
                <Link
                  href={"/adminDashboard/deposits"}
                  className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                    "/adminDashboard/deposits"
                  )}`}
                >
                  <FaBookmark />
                  <span className="text-[15px] ml-4 text-gray-200">
                    All Deposits
                  </span>
                </Link>
                <Link
                  href={"/adminDashboard/kyc"}
                  className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                    "/adminDashboard/kyc"
                  )}`}
                >
                  <FaEnvelope />
                  <span className="text-[15px] ml-4 text-gray-200">
                    Users Kyc
                  </span>
                </Link>
                <Link
                  href={"/adminDashboard/copy-trades"}
                  className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                    "/adminDashboard/copy-trades"
                  )}`}
                >
                  <FaBookmark />
                  <span className="text-[15px] ml-4 text-gray-200">
                    Copy Trades
                  </span>
                </Link>
                <Link
                  href={"/adminDashboard/edit-copy-trade"}
                  className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                    "/adminDashboard/edit-copy-trade"
                  )}`}
                >
                  <FaBookmark />
                  <span className="text-[15px] ml-4 text-gray-200">
                    Edit Copy Trades
                  </span>
                </Link>
                <Link
                  href={"/adminDashboard/trades"}
                  className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                    "/adminDashboard/trades"
                  )}`}
                >
                  <FaBookmark />
                  <span className="text-[15px] ml-4 text-gray-200">
                    Quick Trades
                  </span>
                </Link>
                <Link
                  href={"/adminDashboard/transaction-pins"}
                  className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                    "/adminDashboard/transaction-pins"
                  )}`}
                >
                  <FaBookmark />
                  <span className="text-[15px] ml-4 text-gray-200">
                    Users Pin
                  </span>
                </Link>
                <Link
                  href={"/adminDashboard/kyc"}
                  className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                    "/adminDashboard/kyc"
                  )}`}
                >
                  <FaEnvelope />
                  <span className="text-[15px] ml-4 text-gray-200">
                    Users Kyc
                  </span>
                </Link>
                <Link
                  href={"/adminDashboard/balance"}
                  className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                    "/adminDashboard/balance"
                  )}`}
                >
                  <FaEnvelope />
                  <span className="text-[15px] ml-4 text-gray-200">
                    Users Balance
                  </span>
                </Link>
          <Link
                  href={"/adminDashboard/send-mails"}
                  className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                    "/adminDashboard/send-mails"
                  )}`}
                >
                  <FaEnvelope />
                  <span className="text-[15px] ml-4 text-gray-200">
                    Send Mails
                  </span>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: isSidebarVisible ? "0%" : "-100%" }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.3 }}
          className={`bg-neutral-950 text-gray-100 p-4 min-h-screen min-w-72 ${
            width! >= 786 ? "block" : "fixed top-0 left-0 z-40"
          }`}
        >
          <div className="p-2.5 mt-1 flex items-center rounded-md">
            <User2Icon className="px-2 py-1 bg-blue-600 rounded-md" />
            <h1 className="text-[15px] ml-3 text-xl text-gray-200 font-bold">
              Admin
            </h1>
          </div>
          <hr className="my-2 text-gray-600" />

          <div>
            <Link
              href={"/adminDashboard"}
              className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                "/adminDashboard"
              )}`}
            >
              <FaHome />
              <span className="text-[15px] ml-4 text-gray-200">Dashboard</span>
            </Link>

            <Link
              href={"/adminDashboard/allInvestments"}
              className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                "/adminDashboard/allInvestments"
              )}`}
            >
              <FaChartArea />
              <span className="text-[15px] ml-4 text-gray-200">
                All Investments
              </span>
            </Link>

            <Link
              href={"/adminDashboard/payinvestment"}
              className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                "/adminDashboard/payinvestment"
              )}`}
            >
              <FaMoneyBillWave />
              <span className="text-[15px] ml-4 text-gray-200">
                Pay Investment
              </span>
            </Link>

            <Link
              href={"/adminDashboard/allWithdrawal"}
              className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                "/adminDashboard/allWithdrawal"
              )}`}
            >
              <FaMoneyBillWave />
              <span className="text-[15px] ml-4 text-gray-200">
                All Withdrawals
              </span>
            </Link>
            <Link
              href={"/adminDashboard/create-copy-trades"}
              className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                "/adminDashboard/create-copy-trades"
              )}`}
            >
              <FaBookmark />
              <span className="text-[15px] ml-4 text-gray-200">Copy Trades</span>
            </Link>
            <Link
              href={"/adminDashboard/purchase-signal"}
              className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                "/adminDashboard/purchase-signal"
              )}`}
            >
              <FaBookmark />
              <span className="text-[15px] ml-4 text-gray-200">Purchase Signal</span>
            </Link>
            <Link
              href={"/adminDashboard/allUsers"}
              className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                "/adminDashboard/allUsers"
              )}`}
            >
              <FaBookmark />
              <span className="text-[15px] ml-4 text-gray-200">All Users</span>
            </Link>
            <Link
                  href={"/adminDashboard/signal-purchases"}
                  className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                    "/adminDashboard/signal-purchases"
                  )}`}
                >
                  <FaBookmark />
                  <span className="text-[15px] ml-4 text-gray-200">
                    Purchase Signals
                  </span>
                </Link>
                <Link
                  href={"/adminDashboard/deposits"}
                  className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                    "/adminDashboard/deposits"
                  )}`}
                >
                  <FaBookmark />
                  <span className="text-[15px] ml-4 text-gray-200">
                    All Deposits
                  </span>
                </Link>
                <Link
                  href={"/adminDashboard/kyc"}
                  className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                    "/adminDashboard/kyc"
                  )}`}
                >
                  <FaEnvelope />
                  <span className="text-[15px] ml-4 text-gray-200">
                    Users Kyc
                  </span>
                </Link>
                <Link
                  href={"/adminDashboard/copy-trades"}
                  className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                    "/adminDashboard/copy-trades"
                  )}`}
                >
                  <FaBookmark />
                  <span className="text-[15px] ml-4 text-gray-200">
                    Copy Trades
                  </span>
                </Link>
                <Link
                  href={"/adminDashboard/trades"}
                  className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                    "/adminDashboard/trades"
                  )}`}
                >
                  <FaBookmark />
                  <span className="text-[15px] ml-4 text-gray-200">
                    Quick Trades
                  </span>
                </Link>
                <Link
                  href={"/adminDashboard/transaction-pins"}
                  className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                    "/adminDashboard/transaction-pins"
                  )}`}
                >
                  <FaBookmark />
                  <span className="text-[15px] ml-4 text-gray-200">
                    Users Pin
                  </span>
                </Link>
                <Link
                  href={"/adminDashboard/kyc"}
                  className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                    "/adminDashboard/kyc"
                  )}`}
                >
                  <FaEnvelope />
                  <span className="text-[15px] ml-4 text-gray-200">
                    Users Kyc
                  </span>
                </Link>
                <Link
                  href={"/adminDashboard/balance"}
                  className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                    "/adminDashboard/balance"
                  )}`}
                >
                  <FaEnvelope />
                  <span className="text-[15px] ml-4 text-gray-200">
                    Users Balance
                  </span>
                </Link>
                <Link
                  href={"/adminDashboard/edit-copy-trade"}
                  className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                    "/adminDashboard/edit-copy-trade"
                  )}`}
                >
                  <FaBookmark />
                  <span className="text-[15px] ml-4 text-gray-200">
                    Edit Copy Trades
                  </span>
                </Link>
               <Link
                  href={"/adminDashboard/send-mails"}
                  className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                    "/adminDashboard/send-mails"
                  )}`}
                >
                  <FaEnvelope />
                  <span className="text-[15px] ml-4 text-gray-200">
                    Send Mails
                  </span>
                </Link>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Sidebar;
