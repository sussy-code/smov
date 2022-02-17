import Fuse from 'fuse.js'

const BASE_URL = `${process.env.REACT_APP_CORS_PROXY_URL}https://stream.vidzstore.com`;

async function findContent(searchTerm, type) {
    if (type === 'show') return { options: [] };
    try {
        const searchUrl = `${BASE_URL}/search.php?sd=${searchTerm.replace(/ /g, "_")}`;
        const searchRes = await fetch(searchUrl).then((d) => d.text());

        const parser = new DOMParser();
        const doc = parser.parseFromString(searchRes, "text/html");
        const nodes = [...doc.querySelectorAll(".post")];
        const results = nodes.map(node => {
            const title = node.querySelector("a").title.replace(/-/g, " ").trim();
            const titleArray = title.split(" ");
            titleArray.splice(-2);
            return {
                type,
                title: titleArray.join(" "),
                year: node.querySelector(".post-meta").innerText.split(" ").pop().split("-").shift(),
                slug: encodeURIComponent(node.querySelector("a").href.split('/').pop()),
                source: "vidzstore",
            }
        });
        
        const fuse = new Fuse(results, { threshold: 0.3, keys: ["title"] });
        const matchedResults = fuse
            .search(searchTerm)
            .map(result => result.item);

        if (matchedResults.length === 0) {
            return { options: [] };
        }

        if (matchedResults.length > 1) {
            const res = { options: [] };
    
            matchedResults.forEach((r) => res.options.push({
                title: r.title,
                slug: r.slug,
                type: r.type,
                year: r.year,
                source: 'vidzstore'
            }));
    
            return res;
        } else {
            const { title, slug, type, year } = matchedResults[0];
    
            return {
                options: [{ title, slug, type, year, source: 'vidzstore' }]
            }
        }
    } catch {
        return { options: [] };
    }
}

async function getStreamUrl(slug) {
    const url = `${BASE_URL}/${decodeURIComponent(slug)}`;

    const res = await fetch(url).then(d => d.text());
    const DOM = new DOMParser().parseFromString(res, "text/html");

    return { url: DOM.querySelector("source").src };
}

const vidzstore = { findContent, getStreamUrl }
export default vidzstore;