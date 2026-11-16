export type StructsPost = {
  title: string;
  href: string;
  image: string;
  date: string;
  summary: string;
};

const SITE = "https://www.playstructs.com/";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

function decode(text: string) {
  return text
    .replace(/<[^>]+>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .trim();
}

/** Normalize scraped dates to a short, fixed-width style: "27 Oct 2026". */
export function formatPostDate(raw: string): string {
  const text = raw.trim();
  if (!text) return "";

  // Prefer the leading calendar date when a range is present.
  const leading = text.match(
    /^([A-Za-z]+)\s+(\d{1,2})(?:,)?\s+(\d{4})/,
  );
  if (leading) {
    const [, monthName, day, year] = leading;
    const monthIndex = MONTHS.findIndex(
      (m) => monthName.toLowerCase().startsWith(m.toLowerCase()),
    );
    if (monthIndex >= 0) {
      return `${Number(day)} ${MONTHS[monthIndex]} ${year}`;
    }
  }

  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    const [, year, month, day] = iso;
    return `${Number(day)} ${MONTHS[Number(month) - 1]} ${year}`;
  }

  return text;
}

function readPost(item: string): StructsPost | null {
  const href = item.match(/href="(\/post\/[^"]+)"/)?.[1];
  const title = item.match(/<h3 class="name">([\s\S]*?)<\/h3>/)?.[1];
  if (!href || !title) return null;

  const image = item.match(
    /src="(https:\/\/cdn\.prod\.website-files\.com\/[^"]+)"/,
  )?.[1];
  const date = item.match(/<div class="date">([\s\S]*?)<\/div>/)?.[1];
  const summary = item.match(
    /<div class="description">([\s\S]*?)<\/div>/,
  )?.[1];

  return {
    title: decode(title),
    href: new URL(href, SITE).toString(),
    image: image ?? "",
    date: date ? formatPostDate(decode(date)) : "",
    summary: summary ? decode(summary) : "",
  };
}

/** Posts from the Structs site "Latest Updates" list, newest first. */
export async function getStructsPosts(limit = 4): Promise<StructsPost[]> {
  try {
    const response = await fetch(SITE, { next: { revalidate: 3600 } });
    if (!response.ok) return [];
    const html = await response.text();
    const posts: StructsPost[] = [];
    for (const match of html.matchAll(
      /class="collection-item w-dyn-item"[\s\S]*?<\/a>/g,
    )) {
      const post = readPost(match[0]);
      if (!post) continue;
      posts.push(post);
      if (posts.length >= limit) break;
    }
    return posts;
  } catch {
    return [];
  }
}
