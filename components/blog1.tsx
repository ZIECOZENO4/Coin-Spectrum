import React from "react";

const Blog1 = () => {
  return (
    <div>
      <section className="py-5 md:pt-10 px-6 md:px-10 ">
        <div className="container">
          <div className="flex flex-wrap justify-center -mx-4">
            <div className="w-full px-4">
              <div className="text-center mx-auto mb-[60px] lg:mb-20 max-w-[510px]">
                <span className="font-semibold text-lg text-primary  mb-2 block">
                  Our Blogs
                </span>
                <h2
                  className="
                  font-bold
                  text-3xl
                  sm:text-4xl
                  md:text-[40px]
                  text-white
                  mb-4
                  "
                >
                  Our Recent News
                </h2>
                <p className="text-base text-slate-200">
                  View our latest news and trending informations, as well as
                  frequent questions and how we solved them on our blog.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 lg:w-1/3 px-4">
              <div className="max-w-[370px] mx-auto mb-10">
                <div className="rounded overflow-hidden mb-8">
                  <img
                    src="/images/bfx1.jpg"
                    alt="image"
                    className="w-full"
                  />
                </div>
                <div>
                  <span
                    className="
                     bg-primary
                     rounded
                     inline-block
                     text-center
                     py-1
                     px-4
                     text-xs
                     leading-loose
                     font-semibold
                     text-white
                     mb-5
                     "
                  >
                    Dec 22, 2023
                  </span>
                  <h3>
                    <a
                      href="javascript:void(0)"
                      className="
                        font-semibold
                        text-xl
                        sm:text-2xl
                        lg:text-xl
                        xl:text-2xl
                        mb-4
                        inline-block
                        text-slate-100
                        hover:text-primary
                        "
                    >
                      How to reduce your trading risk, and increasing your
                      profits.
                    </a>
                  </h3>
                  <p className="text-base text-slate-300">
                    In the volatile world of forex trading, managing risk while
                    maximizing profits stands as the cornerstone of a successful
                    strategy. This article delves into practical techniques to
                    shield your investments from unexpected market swings and
                    leverage opportunities for substantial gains. From employing
                    stop-loss orders to diversifying your trading portfolio, we
                    explore a range of methods that can help both novice and
                    seasoned traders achieve a more favorable balance between
                    risk and reward. Join us as we unpack these strategies to
                    help you become a more resilient and profitable trader.
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 lg:w-1/3 px-4">
              <div className="max-w-[370px] mx-auto mb-10">
                <div className="rounded overflow-hidden mb-8">
                  <img
                    src="/images/bfx2.jpg"
                    alt="image"
                    className="w-full"
                  />
                </div>
                <div>
                  <span
                    className="
                     bg-primary
                     rounded
                     inline-block
                     text-center
                     py-1
                     px-4
                     text-xs
                     leading-loose
                     font-semibold
                     text-white
                     mb-5
                     "
                  >
                    Mar 15, 2023
                  </span>
                  <h3>
                    <a
                      href="javascript:void(0)"
                      className="
                        font-semibold
                        text-xl
                        sm:text-2xl
                        lg:text-xl
                        xl:text-2xl
                        mb-4
                        inline-block
                        text-slate-100
                        hover:text-primary
                        "
                    >
                      How to earn more money an investor on Binance FX
                    </a>
                  </h3>
                  <p className="text-base text-slate-300">
                    Unlock the potential of your investments with Binance FX by
                    exploring diverse earning strategies tailored for every type
                    of investor. Whether you&apos;re interested in staking
                    cryptocurrencies, participating in liquidity pools, or
                    leveraging automated investment plans, Binance offers a
                    plethora of options to enhance your investment portfolio.
                    This guide will walk you through various methods such as
                    DeFi staking, Auto-Invest plans, and Dual Investment
                    opportunities, helping you to maximize returns while
                    managing risks effectively. Dive into the world of Binance
                    FX and start optimizing your investment strategy today for
                    better financial growth tomorrow.
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 lg:w-1/3 px-4">
              <div className="max-w-[370px] mx-auto mb-10">
                <div className="rounded overflow-hidden mb-8">
                  <img
                    src="/images/bfx4.jpg"
                    alt="image"
                    className="w-full"
                  />
                </div>
                <div>
                  <span
                    className="
                     bg-primary
                     rounded
                     inline-block
                     text-center
                     py-1
                     px-4
                     text-xs
                     leading-loose
                     font-semibold
                     text-white
                     mb-5
                     "
                  >
                    Jan 05, 2023
                  </span>
                  <h3>
                    <a
                      href="javascript:void(0)"
                      className="
                        font-semibold
                        text-xl
                        sm:text-2xl
                        lg:text-xl
                        xl:text-2xl
                        mb-4
                        inline-block
                        text-slate-100
                        hover:text-primary
                        "
                    >
                      The no-fuss guide to upselling and cross selling
                    </a>
                  </h3>
                  <p className="text-base text-slate-300">
                    Master the art of increasing your sales without complicating
                    the process with our straightforward guide to upselling and
                    cross-selling. Discover how to enhance your revenue by
                    offering logically related products that not only meet the
                    needs of your customers but also enhance their experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog1;
