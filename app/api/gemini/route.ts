import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

const apiKey: string | undefined = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey!)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

export async function POST(request: Request){
    //console.log(await request.json());
    
    try{
        const { prompt } = await request.json();
        console.log(prompt);
        
        if (!prompt) {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            );
        }
        
        const answer = await model.generateContent(prompt); 
        
        return NextResponse.json(answer.response.text());

    }
    catch (error: any){
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}