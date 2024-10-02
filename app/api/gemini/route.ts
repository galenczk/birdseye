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
        if(section.includes('##')){
            const editedHeadline = section.replaceAll('##', '')
            classifiedSections.push({
                type: 'headline',
                content: editedHeadline,
            });
            continue
        }
        
        else if (section.includes('*')) {
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

        /*
        if (!prompt) {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            );
        };
        */
        
        //const responseBody = await model.generateContent(prompt);
        //const formattedAnswer = formatGeminiAnswer(responseBody.response.text())

        const testResponse = `## Generic Example of Bard's Response:

**Headline:** [Relevant and descriptive headline based on the user's prompt]

**Introduction:** [Briefly introduce the topic and provide context for the response]

**Body:**

* **Bullet Point 1:** [Clear and concise point, possibly with supporting details]
* **Bullet Point 2:** [Another relevant point, possibly with examples or explanations]
* **Bullet Point 3:** [Additional point that adds value to the response]

**Possible Additional Elements:**

* **Subheadings:** [For organizing longer responses into clear sections]
* **Lists:** [To present information in a structured and easy-to-read format]
* **Code:** [To illustrate technical concepts or provide code snippets]
* **Images/Visuals:** [To enhance understanding or add visual appeal]
* **Links:** [To provide additional resources or context]

**Conclusion:** [Summarize the main points and offer a final thought or call to action]

**Disclaimer:** This is a generic example and the actual response will vary depending on the user's prompt and the context of the conversation.

**Note:** Bard is still under development and its responses may change over time.`;

        //console.log(formatGeminiAnswer(testResponse));
        

        return NextResponse.json(testResponse);
       
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
