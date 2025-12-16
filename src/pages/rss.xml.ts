import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { slugifyStr } from "@/utils/slugify";
import getSortedPosts from "@/utils/getSortedPosts";
import { SITE } from "@/config";

export async function GET() {
	const posts = await getCollection("blog");
	const sortedPosts = getSortedPosts(posts);
	return rss({
		title: SITE.title,
		description: SITE.desc,
		site: SITE.website,
		items: sortedPosts.map(({ data }) => ({
			link: `/posts/${slugifyStr(data.title)}`,
			title: data.title,
			description: data.description,
			pubDate: new Date(data.date),
		})),
	});
}
