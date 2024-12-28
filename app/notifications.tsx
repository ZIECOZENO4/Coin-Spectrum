"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

const NotificationComponent: React.FC<{ disabledPaths: string[] }> = ({
  disabledPaths,
}) => {
  const pathname = usePathname();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (!disabledPaths.includes(pathname)) {
      const interval = setInterval(() => {
        const notification = generateNotification();
        addNotification(notification);
        toast(notification.description, {
          icon: notification.icon,
          className: notification.classNames,
          style: { background: notification.color, color: "black" },

          position: "top-right",
          duration: 4000, // Customize the duration as needed
        });
      }, 20000);

      return () => clearInterval(interval);
    }
  }, [pathname, disabledPaths, addNotification]);

  return <div></div>; // No need to return anything as <Toaster /> is already in layout
};

export default NotificationComponent;

import { faker } from "@faker-js/faker";
import { FaDollarSign, FaChartLine, FaHandHoldingUsd } from "react-icons/fa";
import { useNotificationStore } from "@/lib/zuustand-store";

const generateNotification = () => {
  const typeIndex = Math.floor(Math.random() * 3);
  const types = ["Deposit", "Withdrawal", "Profit"] as const;
  const type = types[typeIndex];

  let description = "";
  let icon;
  let color;
  let classNames = "";

  switch (type) {
    case "Deposit":
      description = `${faker.person.fullName()} deposited $${faker.finance.amount()}`;
      icon = <FaDollarSign />;
      color = "green";
      classNames = "bg-green-500 text-black";
      break;
    case "Withdrawal":
      description = `${faker.person.fullName()} withdrew $${faker.finance.amount()}`;
      icon = <FaHandHoldingUsd />;
      color = "red";
      classNames = "bg-red-400 text-black";
      break;
    case "Profit":
      description = `${faker.person.fullName()} got a profit of $${faker.finance.amount()}`;
      icon = <FaChartLine />;
      color = "green";
      classNames = "text-orange text-black";
      break;
  }

  return { type, description, icon, classNames, color };
};
