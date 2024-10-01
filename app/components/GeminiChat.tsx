'use client';

import { useState } from 'react';

export default function GeminiChat() {
    // States for geminichat interface
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    // Handles geminichat prompt submissions
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);

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
            console.log(geminiAnswerSections);

            //let geminiAnswer = response.text()
            for (let index = 0; index < geminiAnswerSections.length; index++) {
                console.log(geminiAnswerSections[index]);

                setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: geminiAnswerSections[index] }]);
            }
            setInput('');
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
            <div className=''>
                <div className=''>
                    <h2 className='text-center text-white mb-4'>Gemini Chat New</h2>

                    <div className='bg-white h-96 overflow-y-scroll p-2 mb-4 rounded-lg'>
                        {messages.map((message, index) => (
                            <div key={index} className={message.role === 'user' ? 'text-right' : 'text-left'}>
                                <span key={index} className={message.role === 'user' ? 'text-blue-400 text-sm mr-2' : 'text-black font-bold'}>
                                    {(() => {
                                        if (message.role === 'user') {
                                            return <p>{message.content}</p>;
                                        } else {
                                            if (message.content.type === 'paragraph') {
                                                return <p>{message.content.content}</p>;
                                            } else if (message.content.type === 'bullet') {
                                                return (
                                                    <ul>
                                                        {message.content.content.map((listItem, index) => (
                                                            <li key={index} className='ml-4'>
                                                                - {listItem}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                );
                                            }
                                            return null;
                                        }
                                    })()}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Chat input */}
                    <form onSubmit={handleSubmit} className='flex h-24'>
                        <input
                            type='text'
                            //value={input}
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
