

export default async function Home() {

    let data = await fetch('http://localhost:3000/api/headlines')
    let articles = await data.json()
    
    return (
        <div>
            
            {articles.data.map((article, key) => (
                <div id={key}>{article.title}</div>
            ))}
            
        </div>
    );
}
