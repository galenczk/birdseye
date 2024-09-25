

export default async function Home() {

    let data = await fetch('http://localhost:3000/api/headlines')
    let articles = await data.json()
    console.log(articles);
    
    

    return (
        <div>
            
            
        </div>
    );
}
