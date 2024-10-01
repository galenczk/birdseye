import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const apiKey: string | undefined = process.env.GEMINI_API_KEY;

const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
];

const genAI = new GoogleGenerativeAI(apiKey!);
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    safetySettings: safetySettings,
});

function splitAnswer(answer: string): string[] {
    // Remove quotes from start and end
    let answerNoQuotes = answer.replace(/["]/g, '');
    let sections = answerNoQuotes.split('\n\n');
    return sections;
}

function formatGeminiAnswer(answer: string) {
    let answerNoBold = answer.replaceAll("**", '')
    
    let unclassifiedSections = splitAnswer(answerNoBold);

    let classifiedSections = [];

    for (let index = 0; index < unclassifiedSections.length; index++) {
        const section = unclassifiedSections[index];
        if (section.includes('*')) {
            const editedBulletList = section.replaceAll('*', '');
            const bulletPoints = editedBulletList.split('\n');
            classifiedSections.push({
                type: 'bullet',
                content: bulletPoints,
            });
            continue;
        }
        classifiedSections.push({
            type: 'paragraph',
            content: section,
        });
    }

    return classifiedSections;
}

export async function POST(request: Request) {
    //console.log(await request.json());

    try {
        const { prompt } = await request.json();

        if (!prompt) {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            );
        };

        const responseBody = await model.generateContent(prompt);
        const formattedAnswer = formatGeminiAnswer(responseBody.response.text())

        return NextResponse.json(formattedAnswer);
       
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
