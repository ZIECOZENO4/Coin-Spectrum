"use client";
import CountUp from "./countup";

interface CountUpData {
  value: number;
  prefix: string;
  text: string;
}

export default function Features() {
  const countUpData: CountUpData[] = [
    { value: 1000000, prefix: "$", text: "Amount Raised from Investors" },
    { value: 500, prefix: "~", text: "Number of Investors" },
    { value: 5, prefix: "", text: "Years in Operation" },
  ];

  return (
    <section className="w-full mt-10 py-1 md:py-2 lg:py-4 bg-neutral-50 dark:bg-neutral-950">
      <div className="container flex flex-col items-center gap-4 px-4 md:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between w-full">
          {countUpData.map((item, index) => (
            <div key={index} className="text-center mb-4 w-full sm:w-auto">
              <CountUp
                end={item.value}
                prefix={item.prefix}
                className="text-3xl sm:text-4xl font-bold text-green-600 dark:text-green-400"
                enableScrollSpy
                scrollSpyDelay={100}
              />
              <p className="mt-2 text-neutral-700 dark:text-neutral-300 text-sm sm:text-base">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
