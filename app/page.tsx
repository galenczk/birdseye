

export default async function Home() {

    let data = await fetch('http://localhost:3000/api/headlines', { cache: 'no-store' })
    let articles = await data.json()
    console.log(articles);
    
    

    return (
        <div>
            <h1>News Items</h1>
            
        </div>
    );
}
