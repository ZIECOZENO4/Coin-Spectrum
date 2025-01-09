import { FocusCards } from "@/components/ui/focus-cards";


export function FocusCardsDemo() {
  const cards = [
    {
      title: "PAXFUL",
      src: "/exchenger-1.png",
      url: 'https://paxful.com/roots/buy-bitcoin',
    },
    {
      title: "COINMAMA",
      src: "/exchenger-2.png",
      url: 'https://www.coinmama.com/',
    },
    {
      title: "DIGATRADE",
      src: "/exchenger-3.png",
      url: 'https://digatrade.com/',
    },
    {
      title: "24xBTC",
      src: "/exchenger-4.png",
      url: 'https://24xbtc.com/',
    },
    {
      title: "CEX.IO",
      src: "/exchenger-9.png",
      url: 'https://cex.io/',
    },
    {
      title: "BITNOVO",
      src: "/exchenger-16.png",
      url: 'https://www.bitnovo.com/comprar-bitcoins',
    },
  ];

  return <FocusCards cards={cards} />;
}
