'use client'
import { useState } from 'react'

let article = `The sprawling business empire created by tribal leaders in northern Wisconsin was born of desperate times, as the Lac du Flambeau Band of Lake Superior Chippewa Indians faced financial ruin. Its subsequent success would be built on the desperate needs of others far from the reservation.\n\nThe tribe had made some poor choices as it sought to expand its fortunes beyond a modest casino in its home state of Wisconsin two decades ago. Grand plans for a floating casino off Cancun, Mexico, collapsed, and a riverboat gambling venture in Mississippi required more cash than the tribe had on hand.\n\nThe resulting loans — $50 million in bonds issued in 2008 at 12% — proved crushing. Struggling to make debt payments, tribal officials soon were forced to slash spending for essential programs on the reservation and lay off dozens of employees.\n\nProtests erupted, with demonstrators barricading themselves inside a government building and demanding audits and investigations. When angry tribal members elected a new governing council, it refused to pay anymore. The tribe defaulted on a loan it had come to regret.\n\nThe LDF tribe turned to the one asset that could distinguish it in the marketplace: sovereign immunity.\n\nThis special status allowed it as a Native American tribe to enter the world of internet lending without interest rate caps, an option not open to other lenders in most states. The annual rates it charged for small-sum, installment loans frequently exceeded 600%.\n\nBusiness partners, seeing the favorable math, were easy to find. So, too, were consumers who had run out of options to pay their bills. Their decisions to sign up for LDF loans often made things worse.\n\nProPublica traced the key decisions that put LDF on the path to becoming a prominent player in a sector of the payday lending industry that has long skirted regulation and drawn controversy.\n\nLDF did not just dabble in this type of lending; it fully embraced it. Like other tribes that have taken this route, LDF built its success on a series of complex business arrangements, with roles and motives difficult to unravel.\n\nOver time, ProPublica found, LDF signed off on deals involving outsiders with histories of predatory practices — associations that carried profound implications for the tribe. Not only did they put the tribe’s reputation at risk, they generated a barrage of costly lawsuits and questions of whether LDF was allowing partners to take advantage of tribal rights to skirt state usury laws.\n\nIn Boston, Brian Coughlin initially had no idea that a Native American tribe was involved in the small loan he took out with a high interest rate. He only learned about LDF after he filed for bankruptcy to seek protection from his creditors.\n\n“I was definitely surprised,” he said. “I didn’t think they operated things like that.”\n\nDuring the bankruptcy process, an LDF partner still hounded him to pay, which Coughlin said pushed him to a breaking point and a suicide attempt. Federal law prohibits chasing debtors who have filed for bankruptcy, and Coughlin sued the tribe in a dispute that went all the way to the U.S. Supreme Court. Last year, the court — in a decision with far-reaching implications for tribes — ruled that LDF could be held liable under the Bankruptcy Code.\n\n`;

const title =
    'Desperate Times Led Wisconsin Tribe to High-Interest Lending, Dubious Partnerships and Legal Jeopardy';

const sections = article.split('\n\n');

export default function ArticlePage() {

    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (event: React.FormEvent) => {
        console.log(input);
        
        event.preventDefault()
        setLoading(true);        

        const userMessage = { role: 'user', content: input}

        setMessages((prevMessages) => [...prevMessages, userMessage])

        try {
            const response = await fetch('http://localhost:3000/api/gemini', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: input }),
            });

            const geminiAnswer = response.text();
            console.log(geminiAnswer);

            setMessages((prevMessages) => [...prevMessages, {role: 'assistant', content: geminiAnswer}])
        } catch (error) {
            console.error('Error fetching the Gemini response: ', error);
        } finally {
            setLoading(false)
            setInput('')
        }
    }
        
    return (
        <>
            <div className='flex justify-around'>
                <div className='w-1/2 self-center bg-slate-700'>
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
                    {sections.map((section, key) => (
                        <p key={key} className='p-4  text-white'>
                            {section}
                        </p>
                    ))}
                </div>
                {/* Gemini chat interface */}
                <div className='w-1/2 bg-red-400'>
                    <div className='bg-slate-500 h-3/4 w-3/4 mx-auto p-4'>
                        <h2 className='text-center text-white mb-4'>
                            Gemini Chat
                        </h2>

                        <div className='chat-messages bg-white h-24 overflow-y-scroll p-2 mb-4 rounded-lg'>
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={
                                        message.role === 'user'
                                            ? 'text-right'
                                            : 'text-left'
                                    }>
                                    <span
                                        className={
                                            message.role === 'user'
                                                ? 'text-blue-500'
                                                : 'text-green-500'
                                        }>
                                        {message.content}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Chat input */}
                        <form onSubmit={handleSubmit} className='flex'>
                            <input
                                type='text'
                                //value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder='Type your message...'
                                className='w-full p-2 rounded-lg'
                            />
                            <button
                                type='submit'
                                className='ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg'>
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
