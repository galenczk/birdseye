
// Gets a single article content from the 3 pulled from TNAPI
async function getArticle(articleKey: number) {
    const multiArticleData = await fetch('http://localhost:3000/api/headlines')
    const multiArticles = await multiArticleData.json();
    // Change 0 to articleKey for dynamism
    const singleArticleURL = multiArticles.data[articleKey].url;

    const singleArticleData = await fetch(
        'http://localhost:3000/api/articles',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: singleArticleURL }),
        }
    );
    const { title, singleArticleContent } = await singleArticleData.json();
    
    const formattedArticle = formatArticle(singleArticleContent)    

    return { title, formattedArticle };     

}
    

function formatArticle(article: string): string[] {
    const sections = article.split('\n\n');
    return sections;
}


export default async function ArticleReader(props) {
    // Gets article from 3 pulled from TNAPI based on articlekey in url params
    const { title, formattedArticle } = await getArticle(
        props.params.articleKey
    );
    
    return (
        <>
            <div className=''>
                <div className=''>
                    <h1 className='p-4  text-white font-bold text-xl text-center'>
                        {title}
                    </h1>
                    <div className='text-center '>
                        <h2 className='text-white mb-2'>
                            ***BY LINE***
                        </h2>
                        <h2 className='text-slate-400 mb-2'>
                            Copyright 2024 Pro Publica Inc.
                        </h2>
                    </div>
                    <div className='border-slate-800 border-b-2 w-3/4 mx-auto' />
                    {formattedArticle.map((section, key) => (
                        <p key={key} className='p-4  text-white'>
                            {section}
                        </p>
                    ))}
                </div>
            </div>
        </>
    );
}
