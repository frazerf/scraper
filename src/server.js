import puppeteer from 'puppeteer';
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const url = "https://www.joshwcomeau.com/";

let articleCache = [];

// Function to fetch articles using Puppeteer
const fetchFromSource = async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const allArticles = await page.evaluate(() => {
        const articles = document.querySelectorAll('article');
        return Array.from(articles).slice(0, 3).map((article) => {
            const title = article.querySelector('h3').innerText;
            const url = article.querySelector('a').href;
            return { title, url };
        });
    });

    await browser.close();
    return allArticles;
};

// Periodically fetch articles and update cache
const updateCache = async () => {
    try {
        const articles = await fetchFromSource();
        articleCache = articles;
        console.log("Cache updated!");
    } catch (error) {
        console.error("Error updating cache:", error);
    }
};

// Serve articles from cache
app.get('/articles', (req, res) => {
    res.json(articleCache);
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);

    // Update the cache immediately when the server starts
    updateCache();

    // Then update the cache every 10 minutes
    setInterval(updateCache, 10 * 60 * 1000);
});
