import { FocusCards } from "@/components/ui/focus-cards";


export function FocusCardsDemo() {
  const cards = [
    {
      title: "KRAKEN",
      src: "/ws1.jpg",
      url: 'https://www.kraken.com/',
    },
    {
      title: "COINMAMA",
      src: "/ws3.jpg",
      url: 'https://www.coinmama.com/',
    },
    {
      title: "COINBASE",
      src: "/ws4.jpg",
      url: 'https://www.coinbase.com/',
    },
    {
      title: "TRUST WALLET",
      src: "/ws5.jpg",
      url: 'https://trustwallet.com/?utm_source=cryptwerk',
    },
    {
      title: "CEX.IO",
      src: "/ws7.jpg",
      url: 'https://cex.io/',
    },
    {
      title: "CRYPTO.COM",
      src: "/ws2.jpg",
      url: 'https://crypto.com ',
    },
  ];

  return <FocusCards cards={cards} />;
}
