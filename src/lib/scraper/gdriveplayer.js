// THIS SCRAPER CURRENTLY WORKS AND IS IN USE
import CryptoJS from "crypto-js";
import { unpack } from "unpacker";

const BASE_URL = `${process.env.REACT_APP_CORS_PROXY_URL}https://database.gdriveplayer.us`;
const API_URL = `${process.env.REACT_APP_CORS_PROXY_URL}https://api.gdriveplayer.us`;

const format = {
    stringify: (cipher) => {
        const ct = cipher.ciphertext.toString(CryptoJS.enc.Base64);
        const iv = cipher.iv.toString() || "";
        const salt = cipher.salt.toString() || "";
        return JSON.stringify({
            ct,
            iv,
            salt,
        });
    },
    parse: (jsonStr) => {
        const json = JSON.parse(jsonStr);
        const ciphertext = CryptoJS.enc.Base64.parse(json.ct);
        const iv = CryptoJS.enc.Hex.parse(json.iv) || "";
        const salt = CryptoJS.enc.Hex.parse(json.s) || "";

        const cipher = CryptoJS.lib.CipherParams.create({
            ciphertext,
            iv,
            salt,
        });
        return cipher;
    }
};

async function findContent(searchTerm, type) {
    if (type === 'show') return { options: [] }; // will be like this until rewrite
    try {
        const searchUrl = `${API_URL}/v1/movie/search?title=${searchTerm}`;
        const searchRes = await fetch(searchUrl).then((r) => r.json());
        const results = searchRes.map(movie => {
            return {
                type,
                title: movie.title,
                year: movie.year,
                slug: encodeURIComponent(`player.php?imdb=${movie.imdb}`),
                source: "gdriveplayer",
            }
        });

        return { options: results };
    } catch {
        return { options: [] };
    }
}

async function getStreamUrl(slug) {
    const url = `${BASE_URL}/${decodeURIComponent(slug)}`;
    const res = await fetch(url).then(d => d.text());
    const DOM = new DOMParser().parseFromString(res, "text/html");
    
    const script = [...DOM.querySelectorAll("script")].find(s => s.textContent.includes("eval"));
    const unpacked = unpack(script.textContent);

    const data = unpacked.split("var data=\\'")[1].split("\\'")[0].replace(/\\/g, "");
    const decryptedData = unpack(CryptoJS.AES.decrypt(data, "alsfheafsjklNIWORNiolNIOWNKLNXakjsfwnBdwjbwfkjbJjkopfjweopjASoiwnrflakefneiofrt", { format }).toString(CryptoJS.enc.Utf8));
    // eslint-disable-next-line
    const sources = JSON.parse(JSON.stringify(eval(decryptedData.split("sources:")[1].split(",image")[0].replace(/\\/g, "").replace(/document\.referrer/g, "\"\""))));
    const unmappedSubtitles = JSON.parse(DOM.querySelector("#subtitlez").textContent).filter(s => s.file.length !== 2);
    const subtitles = unmappedSubtitles.map(async (sub) => {
        const subtitleBlob = URL.createObjectURL(await fetch(`${process.env.REACT_APP_CORS_PROXY_URL}${sub.file}`).then(res => res.blob()));
        return {
            file: subtitleBlob,
            language: sub.label,
        }
    });

    return { url: sources[sources.length - 1].file, subtitles };
}

const gdriveplayer = { findContent, getStreamUrl }
export default gdriveplayer;