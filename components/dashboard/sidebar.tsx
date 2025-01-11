

"use client";
import { SearchCheck, User2Icon } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
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
    if (pathname.includes("/deposit")) {
      setDropdownOpen(true);
    } else {
      setDropdownOpen(false);
    }

    if (pathname.includes("/withdraw")) {
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
    if (path === "/dashboard") {
      return pathname === "/dashboard" ? "bg-orange-500" : "";
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
          <SheetContent side="left" className="w-72 bg-neutral-950 p-4">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="text-gray-100 text-xl">
              <div className="p-2.5 mt-1 flex items-center rounded-md">
                <User2Icon className="px-2 py-1 bg-blue-600 rounded-md" />
                <h1 className="text-[15px] ml-3 text-xl text-gray-200 font-bold">
                  Coin Spectrum
                </h1>
              </div>
              <hr className="my-2 text-gray-600" />

              <div>
                <Link
                  href={"/dashboard"}
                  className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                    "/dashboard"
                  )}`}
                >
                  <FaHome />
                  <span className="text-[15px] ml-4 text-gray-200">
                    Dashboard
                  </span>
                </Link>

                <div
                  className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                    "/dashboard/deposit"
                  )}`}
                  onClick={toggleDropdown}
                >
                  <FaChartArea />
                  <div className="flex justify-between w-full items-center">
                    <span className="text-[15px] ml-4 text-gray-200">
                      Deposit
                    </span>
                    <motion.span
                      initial={{ rotate: isDropdownOpen ? 0 : 180 }}
                      animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-sm"
                    >
                      <FaChevronDown />
                    </motion.span>
                  </div>
                </div>
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="leading-7 text-left text-sm font-thin flex flex-col mt-2 w-4/5 mx-auto"
                    >
                      <Link
                        href={"/dashboard/deposit/plans"}
                        className={`cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-1 ${isActive(
                          "/dashboard/deposit/plans"
                        )}`}
                      >
                        Deposit Now
                      </Link>
                      <Link
                        href={"/dashboard/deposit/investments"}
                        className={`cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-1 ${isActive(
                          "/dashboard/deposit/investments"
                        )}`}
                      >
                        Investments
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div
                  className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                    "/dashboard/withdraw"
                  )}`}
                  onClick={toggleWithdrawDropdown}
                >
                  <FaMoneyBillWave />
                  <div className="flex justify-between w-full items-center">
                    <span className="text-[15px] ml-4 text-gray-200">
                      Withdraw
                    </span>
                    <motion.span
                      initial={{ rotate: isWithdrawDropdownOpen ? 0 : 180 }}
                      animate={{ rotate: isWithdrawDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-sm"
                    >
                      <FaChevronDown />
                    </motion.span>
                  </div>
                </div>
                <AnimatePresence>
                  {isWithdrawDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="leading-7 text-left text-sm flex flex-col font-thin mt-2 w-4/5 mx-auto"
                    >
                      <Link
                        href={"/dashboard/withdraw"}
                        className={`cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-1 ${isActive(
                          "/dashboard/withdraw"
                        )}`}
                      >
                        Withdraw Now
                      </Link>
                      <Link
                        href={"/dashboard/withdraw/withdrawals"}
                        className={`cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-1 ${isActive(
                          "/dashboard/withdraw/withdrawals"
                        )}`}
                      >
                        Withdrawals
                      </Link>
                      <Link
                        href={"/dashboard/withdraw/pending"}
                        className={`cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-1 ${isActive(
                          "/dashboard/withdraw/pending"
                        )}`}
                      >
                        Withdraw Now
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Link
                  href={"/dashboard/referral"}
                  className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                    "/dashboard/referral"
                  )}`}
                >
                  <FaBookmark />
                  <span className="text-[15px] ml-4 text-gray-200">
                    Referral
                  </span>
                </Link>

                <Link
                  href={"/dashboard/history"}
                  className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                    "/dashboard/history"
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
          transition={{ duration: 0.5 }}
          className={`fixed md:static top-0 left-0 min-h-screen md:left-auto md:right-0 bottom-0 z-50 md:z-0 p-2 w-72 overflow-y-auto text-center bg-neutral-950 shadow h-screen md:h-auto md:flex md:flex-col pointer-events-auto ${
            isSidebarVisible ? "block" : "hidden"
          } lg:block`}
        >
          <div className="text-gray-100 text-xl">
            <div className="p-2.5 mt-1 flex items-center rounded-md">
              <User2Icon className="px-2 py-1 bg-blue-600 rounded-md" />
              <h1 className="text-[15px] ml-3 text-xl text-gray-200 font-bold">
                Coin Spectrum
              </h1>
            </div>
            <hr className="my-2 text-gray-600" />

            <div>
              <Link
                href={"/dashboard"}
                className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                  "/dashboard"
                )}`}
              >
                <FaHome />
                <span className="text-[15px] ml-4 text-gray-200">
                  Dashboard
                </span>
              </Link>

              <div
                className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                  "/dashboard/deposit"
                )}`}
                onClick={toggleDropdown}
              >
                <FaChartArea />
                <div className="flex justify-between w-full items-center">
                  <span className="text-[15px] ml-4 text-gray-200">
                    Deposit
                  </span>
                  <motion.span
                    initial={{ rotate: isDropdownOpen ? 0 : 180 }}
                    animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm"
                  >
                    <FaChevronDown />
                  </motion.span>
                </div>
              </div>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="leading-7 text-left text-sm font-thin flex flex-col mt-2 w-4/5 mx-auto"
                  >
                    <Link
                      href={"/dashboard/deposit/plans"}
                      className={`cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-1 ${isActive(
                        "/dashboard/deposit/plans"
                      )}`}
                    >
                      Deposit Now
                    </Link>
                    <Link
                      href={"/dashboard/deposit/investments"}
                      className={`cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-1 ${isActive(
                        "/dashboard/deposit/investments"
                      )}`}
                    >
                      Investments
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>

              <div
                className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                  "/dashboard/withdraw"
                )}`}
                onClick={toggleWithdrawDropdown}
              >
                <FaMoneyBillWave />
                <div className="flex justify-between w-full items-center">
                  <span className="text-[15px] ml-4 text-gray-200">
                    Withdraw
                  </span>
                  <motion.span
                    initial={{ rotate: isWithdrawDropdownOpen ? 0 : 180 }}
                    animate={{ rotate: isWithdrawDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm"
                  >
                    <FaChevronDown />
                  </motion.span>
                </div>
              </div>
              <AnimatePresence>
                {isWithdrawDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="leading-7 text-left text-sm flex flex-col font-thin mt-2 w-4/5 mx-auto"
                  >
                    <Link
                      href={"/dashboard/withdraw"}
                      className={`cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-1 ${isActive(
                        "/dashboard/withdraw"
                      )}`}
                    >
                      Withdraw Now
                    </Link>
                    <Link
                      href={"/dashboard/withdraw/withdrawals"}
                      className={`cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-1 ${isActive(
                        "/dashboard/withdraw/withdrawals"
                      )}`}
                    >
                      Withdrawals
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>

              <Link
                href={"/dashboard/referral"}
                className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                  "/dashboard/referral"
                )}`}
              >
                <FaBookmark />
                <span className="text-[15px] ml-4 text-gray-200">Referral</span>
              </Link>

              <Link
                href={"/dashboard/history"}
                className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                  "/dashboard/history"
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
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Sidebar;
