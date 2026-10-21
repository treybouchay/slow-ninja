export type Game = {
  slug: string;
  name: string;
  years: string;
  era: string;
  tagline: string;
  summary: string;
  status: string;
  href: string;
  mechanic: string;
  artwork: string;
  /** Animated art shown in the starlane backdrop when focused */
  motionArt?: string;
  accent: string;
  /** Short flavor line for the atmosphere layer */
  atmosphere: string;
};

export type JournalPost = {
  slug: string;
  title: string;
  date: string;
  readingTime: string;
  excerpt: string;
  tags: string[];
  body: string[];
};

export const studio = {
  name: "Slow Ninja",
  url: "https://slow.ninja/",
  founded: "2014",
  tagline: "Building games for the sentient",
  pitch:
    "We build games as systems you can read—transactions as moves, SQL as a controller, on-chain state as truth.",
};

/** Chronological studio timeline (oldest → newest) */
export const games: Game[] = [
  {
    slug: "schemaverse",
    name: "Schemaverse",
    years: "2010–present",
    era: "2010",
    tagline: "A space war played in SQL",
    summary:
      "Every player is a PostgreSQL role. Buy ships with INSERT, steer with a function call, read the battle in a view. Write PL/pgSQL and the database flies your fleet—or click the map and watch the query it wrote.",
    status: "Ongoing · DEF CON favorite",
    href: "https://schemaverse.com/",
    mechanic: "PostgreSQL as game engine",
    artwork: "/games/schemaverse.png",
    accent: "var(--cyan)",
    atmosphere: "SELECT * FROM ships WHERE fleet = you",
  },
  {
    slug: "coindroids",
    name: "Coindroids",
    years: "2014–2021",
    era: "2014",
    tagline: "Skill-based combat played with coins, for coins",
    summary:
      "The cult classic that helped kick off blockchain gaming. Your actions were transactions—choose carefully. Money was power, literally, in the ruins of 20X5.",
    status: "Archived · lessons live on in Structs",
    href: "https://blog.coindroids.com/",
    mechanic: "Transaction-as-action · multi-chain",
    artwork: "/games/coindroids.jpg",
    accent: "var(--coral)",
    atmosphere: "Ruins of 20X5 · every move a signed tx",
  },
  {
    slug: "structs",
    name: "Structs",
    years: "2022–present",
    era: "2022",
    tagline: "A 5X space strategy game",
    summary:
      "Command sentient machines racing for Alpha Matter across a decentralized Cosmos galaxy. Explore, extract, expand, exterminate, and exchange—then leave the world running for as long as players keep the chain alive.",
    status: "Beta playtest live",
    href: "https://www.playstructs.com/",
    mechanic: "On-chain guild strategy · Cosmos SDK",
    artwork: "/games/structs.png",
    accent: "var(--violet)",
    atmosphere: "Alpha Matter · guild fleets on-chain",
  },
];

export const journalPosts: JournalPost[] = [
  {
    slug: "why-games-should-be-readable",
    title: "Why games should be readable",
    date: "2026-09-12",
    readingTime: "6 min",
    excerpt:
      "From Schemaverse’s SELECT attack() to Structs’ on-chain state, we design worlds where curious players can inspect the machine—not just play on top of it.",
    tags: ["design", "systems"],
    body: [
      "Most games hide their rules behind binary blobs and opaque servers. That can be fine for spectacle. It is a poor fit for skill.",
      "Slow Ninja builds the opposite kind of world. In Schemaverse, the entire simulation lives in PostgreSQL. In Coindroids, every meaningful action was a signed transaction. In Structs, guild power, combat, and economy settle on a chain the community can keep running.",
      "Readable does not mean easy. It means the system is legible enough that mastery is about understanding, not guessing at hidden stats. When a player can open a view, read a block, or replay a query, they stop being a consumer of magic and start becoming a peer of the rules.",
      "That philosophy also shapes how we write about the work. Technical posts are not marketing footnotes—they are part of the product surface. If you can follow how a combat tick resolves, you can fight better. If you can see how guild permissions compose, you can govern better.",
      "The ninja metaphor is deliberate. Speed without comprehension is noise. Slow, precise reading of a system is how you win.",
    ],
  },
  {
    slug: "5x-and-the-extra-exchange",
    title: "5X and the extra Exchange",
    date: "2026-07-28",
    readingTime: "5 min",
    excerpt:
      "4X games already ask you to explore, expand, exploit, and exterminate. Structs adds Exchange—because a decentralized galaxy without markets is just a map.",
    tags: ["structs", "design"],
    body: [
      "Classic 4X loops are excellent at territorial drama and awful at modeling why civilizations trade. Structs treats markets as a first-class verb: Exchange.",
      "On a shared chain, energy, arms, compute, and even worlds can move between guilds without a studio-operated escrow. That changes the metagame. Diplomacy is not a Discord sidebar—it is an economic surface with failure modes you can audit.",
      "Building Exchange into the core loop forced hard technical choices. Pricing primitives had to be composable with combat and planetary extraction. Permissions had to survive hostile guild politics. And every trade had to remain readable after the fact.",
      "The result is a galaxy where conquest is optional and leverage is not. Sometimes the sharpest fleet is the one that never undocks.",
    ],
  },
  {
    slug: "sql-as-a-controller",
    title: "SQL as a controller",
    date: "2026-05-03",
    readingTime: "7 min",
    excerpt:
      "Schemaverse still teaches the same lesson it did in 2010: if your game state fits a relational model, the database can be the arena, the referee, and the API.",
    tags: ["schemaverse", "postgres"],
    body: [
      "Schemaverse began as a provocation and became a teaching tool, a DEF CON fixture, and a reminder that interfaces are design decisions.",
      "When every player is a PostgreSQL role, authorization is not bolted on—it is the game. INSERT buys a ship. A function call steers it. A view is the fog of war. PL/pgSQL scripts become autonomous fleets.",
      "That architecture is extreme on purpose. It collapses the usual stack so the interesting problems—concurrency, trust boundaries, information asymmetry—sit where engineers already have sharp tools.",
      "We still reach for the same instinct on newer projects: put the truth somewhere inspectable, then build interfaces that reveal rather than obscure it. Sometimes that interface is psql. Sometimes it is a guild screen on a Cosmos chain. The craft is knowing which layer should hold the rules.",
    ],
  },
  {
    slug: "lessons-from-a-decade-of-coindroids",
    title: "Lessons from a decade of Coindroids",
    date: "2026-02-18",
    readingTime: "8 min",
    excerpt:
      "Pausing Coindroids was not an ending. It was a field report—what skill-based crypto combat taught us about fees, pacing, narrative, and player trust.",
    tags: ["coindroids", "postmortem"],
    body: [
      "Coindroids proved that blockchain actions could be gameplay, not just payments. It also taught us where that idea breaks.",
      "Fee markets punish deliberation. Confirmation latency fights spectacle. Wallet UX can erase the fantasy of being a machine warlord in 20X5. And communities that show up for DEF CON contests are not the same communities that want daily login loops.",
      "When we paused operations to redevelop, the goal was never to chase a louder token narrative. It was to keep the skill thesis and rebuild the substrate. Structs inherits the insistence that players should earn outcomes—and discards the parts of 2014-era chain UX that made mastery feel like ops work.",
      "If you are shipping a chain-native game today, steal this bias: design for the players who reverse-engineer your systems for fun. They are your best QA, your harshest critics, and often your longest-lived community.",
    ],
  },
];

export function getPost(slug: string) {
  return journalPosts.find((post) => post.slug === slug);
}

export function getGame(slug: string) {
  return games.find((game) => game.slug === slug);
}
