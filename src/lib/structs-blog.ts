export type StructsPost = {
  title: string;
  href: string;
  image: string;
  date: string;
  summary: string;
};

const SITE = "https://www.playstructs.com/";

function decode(text: string) {
  return text
    .replace(/<[^>]+>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .trim();
}

/** First item in the Structs site "Latest Updates" list. */
export async function getLatestStructsPost(): Promise<StructsPost | null> {
  try {
    const response = await fetch(SITE, { next: { revalidate: 3600 } });
    if (!response.ok) return null;
    const html = await response.text();
    const item = html.match(
      /class="collection-item w-dyn-item"[\s\S]*?<\/a>/,
    )?.[0];
    if (!item) return null;

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
      date: date ? decode(date) : "",
      summary: summary ? decode(summary) : "",
    };
  } catch {
    return null;
  }
}
