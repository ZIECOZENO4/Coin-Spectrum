import { cn } from "@/lib/utils";
import Marquee from "./ui/marques";

const reviews = [
  {
    name: "Jack",
    username: "@jack",
    body: "Coin Spectrum has completely transformed my investment portfolio. The returns are incredible and the platform is very user-friendly.",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I've been using Coin Spectrum for a few months now, and I've seen amazing growth in my investments. Highly recommend it to anyone looking to grow their wealth.",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "John",
    username: "@john",
    body: "The customer support at Coin Spectrum is top-notch. They helped me understand the investment options and guided me every step of the way.",
    img: "https://avatar.vercel.sh/john",
  },
  {
    name: "Jane",
    username: "@jane",
    body: "I was skeptical at first, but Coin Spectrum has proven to be a reliable and profitable investment platform. I'm very satisfied with my experience.",
    img: "https://avatar.vercel.sh/jane",
  },
  {
    name: "Jenny",
    username: "@jenny",
    body: "Coin Spectrum offers fantastic investment opportunities. I've been able to achieve my financial goals much faster than I expected.",
    img: "https://avatar.vercel.sh/jenny",
  },
  {
    name: "James",
    username: "@james",
    body: "I love the transparency and security that Coin Spectrum provides. It's a trustworthy platform that has delivered consistent returns.",
    img: "https://avatar.vercel.sh/james",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-72 h-48 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "bg-neutral-900/30"
        // dark styles
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

const MarqueeDemo = () => {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background py-20 md:shadow-xl">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
    </div>
  );
};

export default MarqueeDemo;
