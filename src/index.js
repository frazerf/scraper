const fetchArticles = async () => {
    try {
        const response = await fetch('http://localhost:3000/articles');
        const articles = await response.json();

        // Get the articles container from the page
        const articlesContainer = document.getElementById('articles');

        articles.forEach(article => {
            const articleElem = document.createElement('div');
            articleElem.innerHTML = `
                <h4>${article.title}</h4>
                <a href="${article.url}" target="_blank">Read more</a>
            `;
            articlesContainer.appendChild(articleElem);
        });
    } catch (err) {
        console.error("Failed to fetch articles:", err);
        const errorMsg = document.createElement('p');
        errorMsg.innerText = 'Failed to load articles. Please try again later.';
        document.getElementById('articles').appendChild(errorMsg);
    }
};

fetchArticles();
