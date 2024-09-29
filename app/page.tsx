import Link from 'next/link';

export default async function Home() {
    
    let data = await fetch('http://localhost:3000/api/headlines')
    
    //let data = await fetch('http://localhost:3000/api/headlines', {cache: 'no-cache'});
    
    
    let articles = await data.json();
    console.log(articles);
    
    return (
        <>
            <div>Topics Nav Bar</div>
            <div className='flex mt-8 bg-red-400 mx-24 justify-between'>
                {articles.data.map((article: any, key: string) => (
                    <div key={key} className='p-4 w-1/4'>
                        <img src={article.image_url} width={400} height={300}/>
                        <div className='h-2' />
                        <Link href={`/articles/${key +1}`} className='bg-blue-400'>{article.title}</Link>
                        </div>
                ))}
            </div>
        </>
    );
    
}
