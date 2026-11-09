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
    date: date ? decode(date) : "",
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
