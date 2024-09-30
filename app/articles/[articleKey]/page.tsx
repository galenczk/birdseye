import ArticleReader from '../../components/ArticleReader'
import GeminiChat from '../../components/GeminiChat'

export default function ArticlePage({ params }){
    return (
        <>
            <div className='flex justify-around'>
                <div id='ArticleReader' className='w-1/2 p-4'>
                    <ArticleReader params={params} />
                </div>
                <div id='GeminiChat' className='w-1/2 p-4'>
                    <GeminiChat />
                </div>
            </div>
        </>
    );
}