'use client';

import { useState } from 'react';

export default function GeminiChat() {
    // States for geminichat interface
    const [messages, setMessages] = useState([
        { role: 'user', content: 'Here is a user prompt' },
        {
            role: 'assistant',
            content: {
                type: 'headline',
                content: " Generic Example of Bard's Response:",
            },
        },
        {
            role: 'assistant',
            content: {
                type: 'paragraph',
                content: "Headline: [Relevant and descriptive headline based on the user's prompt]",
            },
        },
        {
            role: 'assistant',
            content: {
                type: 'paragraph',
                content: 'Introduction: [Briefly introduce the topic and provide context for the response]',
            },
        },
        {
            role: 'assistant',
            content: {
                type: 'bullet',
                content: [
                    ' Bullet Point 1: [Clear and concise point, possibly with supporting details]',
                    ' Bullet Point 2: [Another relevant point, possibly with examples or explanations]',
                    ' Bullet Point 3: [Additional point that adds value to the response]',
                ],
            },
        },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    // Handles geminichat prompt submissions
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);

        // Change this schema to include a type: and content:
        // Type will determine article content being hidden from input
        const userMessage = { role: 'user', content: input };

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

            //let geminiAnswer = response.text()
            for (let index = 0; index < geminiAnswerSections.length; index++) {
                setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: geminiAnswerSections[index] }]);
            }
        } catch (error) {
            console.error('Error fetching the Gemini response: ', error);
        } finally {
            setLoading(false);
            setInput('');
        }
    };

    return (
        <>
            {/* Gemini chat interface */}
            <div className='bg-red-500'>
                <div className=''>
                    <div className='flex flex-col'>
                        <h2 className='text-center text-white text-lg'>News GPT Helper</h2>
                        <h2 className='text-slate-400 mb-2 text-center text-sm'>Copyright 2024 Google Gemini</h2>

                        <div className='mx-auto'>Buttons</div>
                    </div>

                    <div className='bg-zinc-600 h-96 overflow-y-scroll p-2 mb-4 rounded-lg'>
                        {messages.map((message, index) => (
                            <div key={index} className={message.role === 'user' ? 'text-right' : 'text-left'}>
                                <div key={index} className={message.role === 'user' ? 'text-slate-300' : 'text-zinc-300 font-bold'}>
                                    {(() => {
                                        if (message.role === 'user') {
                                            // User prompt
                                            return <p className='text-sm mt-2'>{message.content}</p>;
                                        } else {
                                            if (message.content.type === 'headline') {
                                                // Headlines in response
                                                return <h2 className='text-lg'>{message.content.content}</h2>;
                                            } else if (message.content.type === 'paragraph') {
                                                // Paragraphs in response
                                                return <p className='py-1'>{message.content.content}</p>;
                                            } else if (message.content.type === 'bullet') {
                                                // Bulleted list in response
                                                return (
                                                    <ul>
                                                        {message.content.content.map((listItem, index) => (
                                                            <div className='flex'>
                                                                <div>-</div>
                                                                <li key={index} className='ml-2'>
                                                                    {listItem}
                                                                </li>
                                                            </div>
                                                        ))}
                                                    </ul>
                                                );
                                            }
                                            return null;
                                        }
                                    })()}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Chat input */}
                    <form onSubmit={handleSubmit} className='flex h-24'>
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
            </div>
        </>
    );
}
