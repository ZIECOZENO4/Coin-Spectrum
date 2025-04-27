// // Install the required packages if not already installed
// // npm install @faker-js/faker date-fns react-icons

// "use client";

// import { cn } from "@/lib/utils";
// import { AnimatedList } from "./ui/animated-list";
// import { faker } from "@faker-js/faker";
// import { addSeconds, formatDistanceToNow } from "date-fns";
// import { FaDollarSign, FaHandHoldingUsd, FaChartLine } from "react-icons/fa";
// import React from "react";

// enum InvestmentType {
//   Investment = "Investment",
//   Profit = "Profit",
//   Withdrawal = "Withdrawal",
// }

// interface Item {
//   name: string;
//   description: string;
//   icon: React.ReactNode;
//   color: string;
//   time: string;
// }

// const generateRandomInterval = () => {
//   return Math.floor(Math.random() * (180 - 30 + 1)) + 30;
// };

// const roundToNearestHundred = (num: number) => {
//   return Math.round(num / 100) * 100;
// };

// const roundUpToNearestTen = (num: number) => {
//   return Math.ceil(num / 10) * 10;
// };

// const generateNotifications = () => {
//   const notifications = [];
//   const currentTime = new Date();

//   for (let i = 1; i <= 200; i++) {
//     const type =
//       i % 5 === 0
//         ? InvestmentType.Withdrawal
//         : faker.helpers.arrayElement([
//             InvestmentType.Investment,
//             InvestmentType.Profit,
//           ]);
//     let amount;
//     if (type === InvestmentType.Withdrawal) {
//       amount = faker.finance.amount({ min: 10, max: 1000, dec: 0 });
//     } else if (type === InvestmentType.Investment) {
//       amount = roundToNearestHundred(
//         faker.number.int({ min: 100, max: 10000 })
//       );
//     } else {
//       amount = roundUpToNearestTen(faker.number.int({ min: 100, max: 10000 }));
//     }
//     const name = faker.person.fullName();
//     const description =
//       type === InvestmentType.Withdrawal
//         ? `${name} withdrew $${amount}`
//         : `${name} ${
//             type === InvestmentType.Investment ? "invested" : "got profit of"
//           } $${amount}`;
//     const interval = generateRandomInterval();
//     const time = formatDistanceToNow(addSeconds(currentTime, i * interval), {
//       addSuffix: true,
//     });
//     let icon;
//     let color;

//     switch (type) {
//       case InvestmentType.Investment:
//         icon = <FaDollarSign />;
//         color = "#00C9A7";
//         break;
//       case InvestmentType.Profit:
//         icon = <FaChartLine />;
//         color = "#FFB800";
//         break;
//       case InvestmentType.Withdrawal:
//         icon = <FaHandHoldingUsd />;
//         color = "#FF3D71";
//         break;
//     }

//     notifications.push({
//       name,
//       description,
//       icon,
//       color,
//       time,
//     });
//   }

//   return notifications;
// };

// const notifications = generateNotifications();

// const Notification = ({ name, description, icon, color, time }: Item) => {
//   return (
//     <figure
//       className={cn(
//         "relative mx-auto min-h-fit w-full max-w-[600px] transform cursor-pointer overflow-hidden rounded-2xl p-4",
//         // animation styles
//         "transition-all duration-200 ease-in-out hover:scale-[103%]",
//         // light styles
//         "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
//         // dark styles
//         "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
//       )}
//     >
//       <div className="flex flex-row items-center gap-3">
//         <div
//           className="flex h-10 w-10 items-center justify-center rounded-2xl"
//           style={{
//             backgroundColor: color,
//           }}
//         >
//           <span className=" text-md  md:text-lg">{icon}</span>
//         </div>
//         <div className="flex flex-col overflow-hidden">
//           <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white ">
//             <span className="text-sm md:text-lg">{name}</span>
//             <span className="mx-1">·</span>
//             <span className="text-xs  text-gray-500">{time}</span>
//           </figcaption>
//           <p className="text-xs md:text-sm font-normal dark:text-white/60">
//             {description}
//           </p>
//         </div>
//       </div>
//     </figure>
//   );
// };

// export function AnimatedListDemo() {
//   return (
//     <div className="relative flex max-h-[95dvh] min-h-[95dvh] md:max-h-[70dvh] md:min-h-[70dvh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border bg-background p-6 shadow-lg">
//       <AnimatedList>
//         {notifications.map((item, idx) => (
//           <Notification {...item} key={idx} />
//         ))}
//       </AnimatedList>
//     </div>
//   );
// }

"use client";

import { cn } from "@/lib/utils";
import { AnimatedList } from "./ui/animated-list";
import { faker } from "@faker-js/faker";
import { addSeconds, formatDistanceToNow } from "date-fns";
import { FaDollarSign, FaHandHoldingUsd, FaChartLine } from "react-icons/fa";
import React from "react";

enum InvestmentType {
  Investment = "Investment",
  Profit = "Profit",
  Withdrawal = "Withdrawal",
}

interface Item {
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  time: string;
}

const generateRandomInterval = () => {
  return Math.floor(Math.random() * (180 - 30 + 1)) + 30;
};

const roundToNearestHundred = (num: number) => {
  return Math.round(num / 100) * 100;
};

const roundUpToNearestTen = (num: number) => {
  return Math.ceil(num / 10) * 10;
};

const generateNotifications = () => {
  const notifications = [];
  const currentTime = new Date();

  for (let i = 1; i <= 200; i++) {
    const type =
      i % 5 === 0
        ? InvestmentType.Withdrawal
        : faker.helpers.arrayElement([
            InvestmentType.Investment,
            InvestmentType.Profit,
          ]);
    let amount;
    if (type === InvestmentType.Withdrawal) {
      amount = faker.finance.amount({ min: 10, max: 1000, dec: 0 });
    } else if (type === InvestmentType.Investment) {
      amount = roundToNearestHundred(
        faker.number.int({ min: 100, max: 10000 })
      );
    } else {
      amount = roundUpToNearestTen(faker.number.int({ min: 100, max: 10000 }));
    }
    const name = faker.person.fullName();
    const description =
      type === InvestmentType.Withdrawal
        ? `${name} withdrew $${amount}`
        : `${name} ${
            type === InvestmentType.Investment ? "invested" : "got profit of"
          } $${amount}`;
    const interval = generateRandomInterval();
    const time = formatDistanceToNow(addSeconds(currentTime, i * interval), {
      addSuffix: true,
    });
    let icon;
    let colorClass;

    switch (type) {
      case InvestmentType.Investment:
        icon = <FaDollarSign />;
        colorClass = "!bg-green-500";
        break;
      case InvestmentType.Profit:
        icon = <FaChartLine />;

        colorClass = "!bg-yellow-500";
        break;
      case InvestmentType.Withdrawal:
        icon = <FaHandHoldingUsd />;

        colorClass = "!bg-red-500";
        break;
    }

    notifications.push({
      name,
      description,
      icon,
      color: colorClass,
      time,
    });
  }

  return notifications;
};

const notifications = generateNotifications();

const Notification = ({ name, description, icon, color, time }: Item) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[600px] transform cursor-pointer overflow-hidden rounded-2xl p-4",
        // animation styles
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        // light styles
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-2xl",
            color
          )}
        >
          <span className="text-md md:text-lg">{icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white ">
            <span className="text-sm md:text-lg">{name}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500">{time}</span>
          </figcaption>
          <p className="text-xs md:text-sm font-normal dark:text-white/60">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
};

export function AnimatedListDemo() {
  return (
    <div className="relative flex max-h-[80dvh] min-h-[80dvh] md:max-h-[70dvh] md:min-h-[70dvh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border bg-background p-6 shadow-lg">
      <AnimatedList>
        {notifications.map((item, idx) => (
          <Notification {...item} key={idx} />
        ))}
      </AnimatedList>
    </div>
  );
}
