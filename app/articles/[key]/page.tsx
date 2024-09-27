let article = `The sprawling business empire created by tribal leaders in 
                northern Wisconsin was born of desperate times, as the Lac du
                Flambeau Band of Lake Superior Chippewa Indians faced financial
                ruin. Its subsequent success would be built on the desperate
                needs of others far from the reservation.\n\nThe tribe had made
                some poor choices as it sought to expand its fortunes beyond a
                modest casino in its home state of Wisconsin two decades ago.
                Grand plans for a floating casino off Cancun, Mexico,
                collapsed, and a riverboat gambling venture in Mississippi
                required more cash than the tribe had on hand.\n\nThe resulting
                loans — $50 million in bonds issued in 2008 at 12% — proved
                crushing. Struggling to make debt payments, tribal officials
                soon were forced to slash spending for essential programs on
                the reservation and lay off dozens of employees.\n\nProtests
                erupted, with demonstrators barricading themselves inside a
                government building and demanding audits and investigations.
                When angry tribal members elected a new governing council, it
                refused to pay anymore. The tribe defaulted on a loan it had
                come to regret.\n\nThe LDF tribe turned to the one asset that
                could distinguish it in the marketplace: sovereign
                immunity.\n\nThis special status allowed it as a Native
                American tribe to enter the world of internet lending without
                interest rate caps, an option not open to other lenders in most
                states. `;

const title = "Desperate Times Led Wisconsin Tribe to High-Interest Lending, Dubious Partnerships and Legal Jeopardy"

const sections = article.split('\n\n');
console.log(sections[0]);

export default async function ArticlePage() {
    return (
        <>
            <div className='flex flex-col'>
                <div className='w-1/2 mt-8 self-center bg-slate-700'>
                    <h1 className='p-4  text-white font-bold text-xl text-center'>
                        {title}
                    </h1>
                    <div className='text-center '>
                        <h2 className='text-white mb-2'>
                            by Megan O’Matz and Joel Jacobs
                        </h2>
                        <h2 className='text-slate-400 mb-2'>
                            © Copyright 2024 Pro Publica Inc.
                        </h2>
                    </div>
                    <div className='border-slate-800 border-b-2 w-3/4 mx-auto' />
                    {sections.map((section) => (
                        <p className='p-4  text-white'>{section}</p>
                    ))}
                </div>
            </div>
        </>
    );
}
