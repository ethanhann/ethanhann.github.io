import rss from "@astrojs/rss";
import type {APIRoute} from "astro";
import {getCollection} from "astro:content";

export const GET: APIRoute = async (context) => {
    const posts = await getCollection("blog");
    const items = posts
        .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
        .map((post) => ({
            title: post.data.title,
            description: post.data.description,
            pubDate: post.data.date,
            link: `/blog/${post.id}/`,
        }));

    return rss({
        title: "Ethan Hann",
        description: "Writing on software engineering, Rust, and building things.",
        site: context.site!,
        items,
        customData: "<language>en-us</language>",
    });
};
