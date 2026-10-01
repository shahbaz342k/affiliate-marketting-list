import type { NewProduct } from "./schema";

/**
 * Sample products used to populate an empty store so the storefront has
 * something to show. Affiliate links point at store search pages with a
 * placeholder tag — replace them with your own links from the admin panel.
 */
export const sampleProducts: NewProduct[] = [
  {
    name: "Noise-Cancelling Wireless Headphones",
    slug: "noise-cancelling-wireless-headphones",
    description:
      "30-hour battery, buttery-soft earcups and class-leading noise cancelling. The pair I reach for on every flight and long work session.",
    note: "I've owned three pairs of ANC headphones and these are the first ones I never want to take off. Multipoint pairing with laptop + phone just works.",
    price: "279.99",
    currency: "USD",
    imageUrl:
      "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    affiliateUrl:
      "https://www.amazon.com/s?k=noise+cancelling+wireless+headphones&tag=mypicks-20",
    store: "Amazon",
    category: "Audio",
    rating: "4.8",
    featured: true,
    published: true,
  },
  {
    name: "Compact 75% Mechanical Keyboard",
    slug: "compact-75-mechanical-keyboard",
    description:
      "Hot-swappable switches, gasket mount and a satisfying thocky sound out of the box. Wireless with a 2.4GHz dongle and Bluetooth.",
    note: "This replaced a keyboard twice the price on my desk. The stock switches are great, and the knob is more useful than I expected.",
    price: "89.00",
    currency: "USD",
    imageUrl:
      "https://images.pexels.com/photos/38094551/pexels-photo-38094551.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    affiliateUrl: "https://www.amazon.com/s?k=75%25+mechanical+keyboard&tag=mypicks-20",
    store: "Amazon",
    category: "Desk Setup",
    rating: "4.6",
    featured: true,
    published: true,
  },
  {
    name: "Hand Burr Coffee Grinder",
    slug: "hand-burr-coffee-grinder",
    description:
      "Stainless steel conical burrs with 40+ click grind settings. Fits in a backpack and makes café-quality pour-over at home.",
    note: "Yes, it takes a minute of cranking. Yes, the coffee is noticeably better. Great gift for anyone starting their coffee journey.",
    price: "34.99",
    currency: "USD",
    imageUrl:
      "https://images.pexels.com/photos/20804137/pexels-photo-20804137.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    affiliateUrl: "https://www.amazon.com/s?k=hand+burr+coffee+grinder&tag=mypicks-20",
    store: "Amazon",
    category: "Kitchen",
    rating: "4.7",
    featured: false,
    published: true,
  },
  {
    name: "Fitness Smartwatch with GPS",
    slug: "fitness-smartwatch-with-gps",
    description:
      "Built-in GPS, heart-rate tracking, sleep insights and a 10-day battery. Always-on display that's readable in direct sun.",
    note: "The battery life is the killer feature — I charge it once a week and forget about it. Sleep tracking got me to actually go to bed earlier.",
    price: "199.00",
    currency: "USD",
    imageUrl:
      "https://images.pexels.com/photos/18662969/pexels-photo-18662969.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    affiliateUrl: "https://www.amazon.com/s?k=fitness+smartwatch+gps&tag=mypicks-20",
    store: "Amazon",
    category: "Fitness",
    rating: "4.5",
    featured: true,
    published: true,
  },
  {
    name: "Everyday Minimal Backpack 20L",
    slug: "everyday-minimal-backpack-20l",
    description:
      "Weatherproof shell, padded 16\" laptop sleeve and a clean silhouette that works for the office, the gym or a weekend trip.",
    note: "Three years of daily use and it still looks new. The side-access laptop pocket is a lifesaver at airport security.",
    price: "64.00",
    currency: "USD",
    imageUrl:
      "https://images.pexels.com/photos/18510449/pexels-photo-18510449.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    affiliateUrl: "https://www.amazon.com/s?k=minimal+backpack+20l+laptop&tag=mypicks-20",
    store: "Amazon",
    category: "Travel",
    rating: "4.4",
    featured: false,
    published: true,
  },
  {
    name: "LED Architect Desk Lamp",
    slug: "led-architect-desk-lamp",
    description:
      "Wide light bar with adjustable colour temperature and a clamp mount that frees up desk space. Zero flicker, easy on the eyes.",
    note: "Instant upgrade for late-night work. The warm setting is perfect for evenings and it looks great on camera for video calls.",
    price: "45.99",
    currency: "USD",
    imageUrl:
      "https://images.pexels.com/photos/7439756/pexels-photo-7439756.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    affiliateUrl: "https://www.amazon.com/s?k=led+architect+desk+lamp+clamp&tag=mypicks-20",
    store: "Amazon",
    category: "Desk Setup",
    rating: "4.6",
    featured: false,
    published: true,
  },
  {
    name: "Studio Monitor Headphones",
    slug: "studio-monitor-headphones",
    description:
      "Flat, honest sound for mixing, editing and critical listening. Detachable cable and replaceable earpads mean they last for years.",
    note: "If you edit video or make music, these are a no-brainer. Not the most exciting sound, but you hear everything exactly as it is.",
    price: "149.00",
    currency: "USD",
    imageUrl:
      "https://images.pexels.com/photos/3394648/pexels-photo-3394648.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    affiliateUrl: "https://www.amazon.com/s?k=studio+monitor+headphones&tag=mypicks-20",
    store: "Amazon",
    category: "Audio",
    rating: "4.7",
    featured: false,
    published: true,
  },
  {
    name: "Precision Coffee Scale with Timer",
    slug: "precision-coffee-scale-with-timer",
    description:
      "0.1g accuracy, built-in brew timer and a rechargeable battery. Small enough to live on the counter next to your kettle.",
    note: "Consistency is everything with pour-over. This made my morning coffee repeatable instead of a gamble.",
    price: "24.99",
    currency: "USD",
    imageUrl:
      "https://images.pexels.com/photos/9743262/pexels-photo-9743262.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    affiliateUrl: "https://www.amazon.com/s?k=coffee+scale+with+timer&tag=mypicks-20",
    store: "Amazon",
    category: "Kitchen",
    rating: "4.5",
    featured: false,
    published: true,
  },
  {
    name: "Leather Laptop Backpack",
    slug: "leather-laptop-backpack",
    description:
      "Full-grain leather that ages beautifully, with a dedicated laptop compartment and brass hardware. Dressier than a nylon pack.",
    note: "My go-to for client meetings. It's pricier, but it's the kind of bag you keep for a decade.",
    price: "120.00",
    currency: "USD",
    imageUrl:
      "https://images.pexels.com/photos/15059375/pexels-photo-15059375.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    affiliateUrl: "https://www.amazon.com/s?k=leather+laptop+backpack&tag=mypicks-20",
    store: "Amazon",
    category: "Travel",
    rating: "4.3",
    featured: false,
    published: true,
  },
  {
    name: "PBT Keycap Set (Cherry Profile)",
    slug: "pbt-keycap-set-cherry-profile",
    description:
      "Thick double-shot PBT keycaps that won't shine over time. Cherry profile with full coverage for 60% through full-size layouts.",
    note: "The cheapest way to make a keyboard feel brand new. Pairs perfectly with the 75% board above.",
    price: "39.00",
    currency: "USD",
    imageUrl:
      "https://images.pexels.com/photos/34877295/pexels-photo-34877295.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    affiliateUrl: "https://www.amazon.com/s?k=pbt+keycap+set+cherry+profile&tag=mypicks-20",
    store: "Amazon",
    category: "Desk Setup",
    rating: "4.4",
    featured: false,
    published: true,
  },
];
