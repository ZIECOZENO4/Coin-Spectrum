

"use client";
import { SearchCheck, User2Icon } from "lucide-react";
import { SignOutButton, useClerk, UserButton, useUser } from "@clerk/nextjs";
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
  FaIdCard,
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
    isTradeDropdownOpen,
    toggleDropdown,
    toggleTradeDropdown,
    toggleWithdrawDropdown,
    toggleSidebar,
    setDropdownOpen,
    setTradeDropdownOpen,
    setWithdrawDropdownOpen,
  } = useSidebarStore();
  const { width } = useWindowSize();
  const pathname = usePathname();
  const { isLoaded, isSignedIn, user } = useUser();
  useEffect(() => {
    if (pathname.includes("/deposit")) {
      setDropdownOpen(true);
    } else {
      setDropdownOpen(false);
    }

    if (pathname.includes("/trades")) {
      setTradeDropdownOpen(true);
    } else {
      setTradeDropdownOpen(false);
    }

    if (pathname.includes("/withdraw")) {
      setWithdrawDropdownOpen(true);
    } else {
      setWithdrawDropdownOpen(false);
    }
  }, [pathname, setDropdownOpen, setTradeDropdownOpen, setWithdrawDropdownOpen]);
  
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
              <SheetTitle>Coin Spectrum.net</SheetTitle>
            </SheetHeader>
            <div className="text-gray-100 text-xl">
              <div className="p-2.5 mt-1 flex items-center rounded-md">
                <UserButton  />
                <Link href='/dashboard/user-profile'>
                <h1 className="text-[15px] ml-3 text-xl flex gap-2 text-gray-200 font-bold">
              {user && user.firstName ? user.firstName : user ? user.username : "Coin  "}  {" "}
              {user && user.lastName ? user.lastName : user ? user.username : "Spectrum "}
                </h1>
                </Link>
             
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
                      Deposit (Invest)
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
                      href={"/dashboard/makedeposit"}
                      className={`cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-1 ${isActive(
                        "/dashboard/makedeposit"
                      )}`}
                    >
                      Quick Deposit
                    </Link>
                      <Link
                        href={"/dashboard/deposit/plans"}
                        className={`cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-1 ${isActive(
                          "/dashboard/deposit/plans"
                        )}`}
                      >
                        Quick Investment
                      </Link>
                      <Link
                        href={"/dashboard/deposit/investments"}
                        className={`cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-1 ${isActive(
                          "/dashboard/deposit/investments"
                        )}`}
                      >
                       All Investments
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div
                className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                  "/dashboard/trade"
                )}`}
                onClick={toggleTradeDropdown}
              >
                <FaChartArea />
                <div className="flex justify-between w-full items-center">
                  <span className="text-[15px] ml-4 text-gray-200">
                    Trades (USD)
                  </span>
                  <motion.span
                    initial={{ rotate: isTradeDropdownOpen ? 0 : 180 }}
                    animate={{ rotate: isTradeDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm"
                  >
                    <FaChevronDown />
                  </motion.span>
                </div>
              </div>
              <AnimatePresence>
                {isTradeDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="leading-7 text-left text-sm font-thin flex flex-col mt-2 w-4/5 mx-auto"
                  >
                    <Link
                      href={"/dashboard/trade"}
                      className={`cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-1 ${isActive(
                        "/dashboard/trade"
                      )}`}
                    >
                      All Trades
                    </Link>
                    <Link
                      href={"/dashboard/trade/copy-trade"}
                      className={`cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-1 ${isActive(
                        "/dashboard/trade/copy-trade"
                      )}`}
                    >
                     Copy Trades
                    </Link>
                    <Link
                      href={"/dashboard/trade/purchase-signals"}
                      className={`cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-1 ${isActive(
                        "/dashboard/trade/purchase-signals"
                      )}`}
                    >
                    Purchase Signals
                    </Link>
                    <Link
                      href={"/dashboard/trade/news"}
                      className={`cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-1 ${isActive(
                        "/dashboard/trade/news"
                      )}`}
                    >
                    Trade News
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
                        href={"/dashboard/withdraw/Transactionpin"}
                        className={`cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-1 ${isActive(
                          "/dashboard/withdraw/Transactionpin"
                        )}`}
                      >
                       Transaction Pin
                      </Link>
                      <Link
                        href={"/dashboard/withdraw/transfer"}
                        className={`cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-1 ${isActive(
                          "/dashboard/withdraw/transfer"
                        )}`}
                      >
                       Transfer Funds
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Link
                  href={"/dashboard/myreferrals"}
                  className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                    "/dashboard/myreferrals"
                  )}`}
                >
                  <FaBookmark />
                  <span className="text-[15px] ml-4 text-gray-200">
                    Referral
                  </span>
                </Link>
                <Link
                  href={"/dashboard/Kyc"}
                  className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                    "/dashboard/Kyc"
                  )}`}
                >
                  <FaUserShield /> 
                  <span className="text-[15px] ml-4 text-gray-200">
                   Start Kyc
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
                  href={"/dashboard/license"}
                  className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                    "/dashboard/license"
                  )}`}
                >
                   <FaIdCard />
                  <span className="text-[15px] ml-4 text-gray-200">
                  Company License
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
                <SignOutButton>
                <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500">
                  <FaSignOutAlt />
                  <span className="text-[15px] ml-4 text-gray-200">Logout</span>
                </div>
              </SignOutButton>

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
            <UserButton  />
                <Link href='/dashboard/user-profile'>
                <h1 className="text-[15px] ml-3 text-xl flex gap-2 text-gray-200 font-bold">
              {user && user.firstName ? user.firstName : user ? user.username : "Coin  "} {" "}
              {user && user.lastName ? user.lastName : user ? user.username : "Spectrum "}
                </h1>
                </Link>
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
                    Deposit (Invest)
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
                      href={"/dashboard/makedeposit"}
                      className={`cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-1 ${isActive(
                        "/dashboard/makedeposit"
                      )}`}
                    >
                      Quick Deposit
                    </Link>
                    <Link
                      href={"/dashboard/deposit/plans"}
                      className={`cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-1 ${isActive(
                        "/dashboard/deposit/plans"
                      )}`}
                    >
                      Quick Investment
                    </Link>
                    <Link
                      href={"/dashboard/deposit/investments"}
                      className={`cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-1 ${isActive(
                        "/dashboard/deposit/investments"
                      )}`}
                    >
                     All Investments
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
              <div
                className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                  "/dashboard/trades"
                )}`}
                onClick={toggleTradeDropdown}
              >
                <FaChartArea />
                <div className="flex justify-between w-full items-center">
                  <span className="text-[15px] ml-4 text-gray-200">
                    Trades (USD)
                  </span>
                  <motion.span
                    initial={{ rotate: isTradeDropdownOpen ? 0 : 180 }}
                    animate={{ rotate: isTradeDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm"
                  >
                    <FaChevronDown />
                  </motion.span>
                </div>
              </div>
              <AnimatePresence>
                {isTradeDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="leading-7 text-left text-sm font-thin flex flex-col mt-2 w-4/5 mx-auto"
                  >
                    <Link
                      href={"/dashboard/trade"}
                      className={`cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-1 ${isActive(
                        "/dashboard/trade"
                      )}`}
                    >
                      All Trades
                    </Link>
                    <Link
                      href={"/dashboard/trade/copy-trade"}
                      className={`cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-1 ${isActive(
                        "/dashboard/trade/copy-trade"
                      )}`}
                    >
                     Copy Trades
                    </Link>
                    <Link
                      href={"/dashboard/trade/purchase-signals"}
                      className={`cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-1 ${isActive(
                        "/dashboard/trade/purchase-signals"
                      )}`}
                    >
                    Purchase Signals
                    </Link>
                    <Link
                      href={"/dashboard/trade/news"}
                      className={`cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-1 ${isActive(
                        "/dashboard/trade/news"
                      )}`}
                    >
                    Trade News
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
                        href={"/dashboard/withdraw/Transactionpin"}
                        className={`cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-1 ${isActive(
                          "/dashboard/withdraw/Transactionpin"
                        )}`}
                      >
                       Transaction Pin
                      </Link>
                      <Link
                        href={"/dashboard/withdraw/transfer"}
                        className={`cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-1 ${isActive(
                          "/dashboard/withdraw/transfer"
                        )}`}
                      >
                       Transfer Funds
                      </Link>
                  </motion.div>
                )}
              </AnimatePresence>

              <Link
                href={"/dashboard/myreferrals"}
                className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                  "/dashboard/myreferrals"
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
                  href={"/dashboard/Kyc"}
                  className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                    "/dashboard/Kyc"
                  )}`}
                >
                  <FaUserShield /> 
                  <span className="text-[15px] ml-4 text-gray-200">
                   Start Kyc
                  </span>
                </Link>
                <Link
                  href={"/dashboard/license"}
                  className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500 ${isActive(
                    "/dashboard/license"
                  )}`}
                >
                   <FaIdCard />
                  <span className="text-[15px] ml-4 text-gray-200">
                  Company License
                  </span>
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
              <SignOutButton>
              <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-orange-500">
                <FaSignOutAlt />
                <span className="text-[15px] ml-4 text-gray-200">Logout</span>
              </div>
            </SignOutButton>

            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Sidebar;
