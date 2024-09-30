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

            let geminiAnswer = formatGeminiAnswer(await response.text());

            //let geminiAnswer = response.text()
            for (let index = 0; index < geminiAnswer.length; index++) {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { role: 'assistant', content: geminiAnswer[index] },
                ]);
            }

            // This is used to test with geminiTest above.
            //setMessages((prevMessages) => [...prevMessages, {role: 'assistant', content: geminiTest}])
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
                    <h2 className='text-center text-white mb-4'>
                        Gemini Chat New
                    </h2>

                    <div className='bg-white h-96 overflow-y-scroll p-2 mb-4 rounded-lg'>
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
                                            ? 'text-blue-400 text-sm mr-2'
                                            : 'text-black font-bold'
                                    }>
                                    {message.content}
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
                        <button
                            type='submit'
                            className='ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg'>
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
