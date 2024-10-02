import ArticleReader from '../../components/ArticleReader';
import GeminiChat from '../../components/GeminiChat';

// Gets a single article content from the 3 pulled from TNAPI
async function getArticle(articleKey: number) {
    const multiArticleData = await fetch('http://localhost:3000/api/headlines');
    const multiArticles = await multiArticleData.json();
    const singleArticleURL = multiArticles.data[articleKey].url;

    const singleArticleData = await fetch('http://localhost:3000/api/articles', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: singleArticleURL }),
    });
    const { title, singleArticleContent } = await singleArticleData.json();

    const formattedArticle = formatArticle(singleArticleContent);

    return { title, formattedArticle };
}

function formatArticle(article: string): string[] {
    const sections = article.split('\n\n');
    return sections;
}

export default async function ArticlePage({ params }) {
    //console.log(params.articleKey);

    const { title, formattedArticle } = await getArticle(params.articleKey);
    //console.log({ title });

    return (
        <div>
            <div className='flex justify-around'>
                <div id='ArticleReader' className='w-1/2 p-4'>
                    <ArticleReader content={{ title, formattedArticle }} />
                </div>
                <div id='GeminiChat' className='w-1/2 p-4'>
                    <GeminiChat content={{ title, formattedArticle }} />
                </div>
            </div>
        </div>
    );
}
