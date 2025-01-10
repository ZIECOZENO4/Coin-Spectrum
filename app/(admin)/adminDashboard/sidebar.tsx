"use client";
import { SearchCheck, User2Icon } from "lucide-react";
import React, { useEffect } from "react";
import {
  FaHome,
  FaBookmark,
  FaEnvelope,
  FaChevronDown,
  FaSignOutAlt,
  FaChartArea,
  FaMoneyBillWave,
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
            <div className="text-gray-100 text-xl">
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
                  href={"/adminDashboard/allUsers"}
                  className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                    "/adminDashboard/allUsers"
                  )}`}
                >
                  <FaBookmark />
                  <span className="text-[15px] ml-4 text-gray-200">
                    All Users
                  </span>
                </Link>

                <Link
                  href={"/adminDashboard/history"}
                  className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                    "/adminDashboard/history"
                  )}`}
                >
                  <FaEnvelope />
                  <span className="text-[15px] ml-4 text-gray-200">
                    History
                  </span>
                </Link>

                <Link
                  href={"/dashboard/support"}
                  className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                    "/dashboard/support"
                  )}`}
                >
                  <FaEnvelope />
                  <span className="text-[15px] ml-4 text-gray-200">
                    Support
                  </span>
                </Link>

                <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500">
                  <FaSignOutAlt />
                  <span className="text-[15px] ml-4 text-gray-200">Logout</span>
                </div>
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
              Stackit
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
              href={"/adminDashboard/allUsers"}
              className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                "/adminDashboard/allUsers"
              )}`}
            >
              <FaBookmark />
              <span className="text-[15px] ml-4 text-gray-200">All Users</span>
            </Link>

            <Link
              href={"/adminDashboard/history"}
              className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                "/adminDashboard/history"
              )}`}
            >
              <FaEnvelope />
              <span className="text-[15px] ml-4 text-gray-200">History</span>
            </Link>

            <Link
              href={"/dashboard/support"}
              className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                "/dashboard/support"
              )}`}
            >
              <FaEnvelope />
              <span className="text-[15px] ml-4 text-gray-200">Support</span>
            </Link>

            <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500">
              <FaSignOutAlt />
              <span className="text-[15px] ml-4 text-gray-200">Logout</span>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Sidebar;
