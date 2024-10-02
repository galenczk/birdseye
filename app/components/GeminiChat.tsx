'use client';

import { useState, useEffect, useRef } from 'react';

export default function GeminiChat(props) {
    const { title, formattedArticle } = props.content;

    // This scrolls to the bottom of geminichat at each new message
    const scrollRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (scrollRef.current){
             scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    })

    // States for geminichat interface
    // Message is static for styling work. Change this
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    async function summarizeArticle() {
        setLoading(true);

        const articleReference = props.content.formattedArticle;
        const promptSuffix = `\n\n Please summarize this article in a simple and easy-to-read way.`;
        const prompt = articleReference + promptSuffix;
        console.log(prompt);

        try {
            const response = await fetch('http://localhost:3000/api/gemini', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: prompt }),
            });

            let geminiAnswerSections = await response.json();
            console.log(geminiAnswerSections);

            for (let index = 0; index < geminiAnswerSections.length; index++) {
                setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: geminiAnswerSections[index] }]);
            }
            //setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: { type: 'break', content: '' } }]);
        } catch (error) {
            console.error('Error fetchign the Gemini response: ', error);
        } finally {
            setLoading(false);
        }
    }

    async function explainHistory() {
        return;
    }

    async function recommendReading() {
        return;
    }

    // Handles geminichat prompt submissions
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);

        // Change this schema to include a type: and content:
        // Type will determine article content being hidden from input
        const userMessage = { role: 'user', content: { type: 'custom', content: input } };

        setMessages((prevMessages) => [...prevMessages, userMessage]);

        try {
            const response = await fetch('http://localhost:3000/api/gemini', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: input }),
            });

            let geminiAnswerSections = await response.json();

            for (let index = 0; index < geminiAnswerSections.length; index++) {
                setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: geminiAnswerSections[index] }]);
            }
            //setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: { type: 'break', content: '' } }]);
        } catch (error) {
            console.error('Error fetching the Gemini response: ', error);
        } finally {
            setLoading(false);
            setInput('');
        }
    };

    return (
        <div>
            <div className='flex flex-col'>
                <h2 className='text-center text-white text-lg'>News GPT Helper</h2>
                <h2 className='text-slate-400 mb-2 text-center text-sm'>Copyright 2024 Google Gemini</h2>

                <div className='flex mx-auto mb-2'>
                    <button onClick={summarizeArticle}>Summarize Article</button>
                    <button>Explain History of this Topic</button>
                    <button>Recommend Further Reading</button>
                </div>
            </div>
            
            <div ref={scrollRef} className='bg-zinc-600 overflow-y-scroll h-[30rem] p-2 mb-4 rounded-lg flex flex-col'>
                    {messages.map((message: any, index: number) => (
                        <div key={index} className={message.role === 'user' ? 'ml-auto text-justify' : 'mr-auto text-justify'}>
                            <div className={message.role === 'user' ? 'text-zinc-300' : 'text-zinc-300 font-bold'}>
                                {/* Render user and assistant messages */}
                                {(() => {
                                    if (message.role === 'user') {
                                        // User prompt
                                        return <p className='text-sm p-4 m-4 border-slate-400 border-y-2 pl-24'>{message.content.content}</p>;
                                    } else {
                                        return (
                                            <div className=''>
                                                {message.content.type === 'headline' && <h2 className='text-lg'>{message.content.content}</h2>}
                                                {message.content.type === 'break' && <br className='my-1' />}
                                                {message.content.type === 'paragraph' && <p className='py-1'>{message.content.content}</p>}
                                                {message.content.type === 'bullet' && (
                                                    <ul>
                                                        {message.content.content.map((listItem: string, listIndex: number) => (
                                                            <div key={listIndex} className='flex'>
                                                                <div>-</div>
                                                                <li className='ml-2'>{listItem}</li>
                                                            </div>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        );
                                    }
                                })()}
                            </div>
                        </div>
                    ))}
                    
                </div>  

                <form onSubmit={handleSubmit} className='flex h-24 mt-auto'>
                    <input
                        type='text'
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder='Type your message...'
                        className='w-full p-2 rounded-lg'
                    />
                    <button type='submit' className='ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg'>
                        Send
                    </button>
                </form>
            
        </div>
    );
}
