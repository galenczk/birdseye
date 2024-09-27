// app/api/fetch-data/scrape.ts
import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

async function scrapeArticleContent(url: string){
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            Referer: 'https://www.axios.com',
            Cookie: '__cf_bm=<your cookie value here>',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch article content');
    }

    const html = await response.text();

    const $ = cheerio.load(html);

    const contentElements = $("*[data-pp-blocktype='copy']");

    const title = $('h1.opener__hed').text().trim(); // `.trim()` removes extra spaces

    const content =
        contentElements
            .map((i, el) => $(el).text())
            .get()
            .join('\n\n') || 'Content not found.'; // Join texts with line breaks

    // Return the extracted content
    return { title, content };
}


/** Takes in an axios.com URL and scrapes news article from the page.
 * 
 * @param request URL to scrape story from
 * @returns Content of story
 */
export async function POST(request: Request) {
    try {
        const { url } = await request.json();
        
        if (!url) {
            return NextResponse.json(
                { error: 'URL is required' },
                { status: 400 }
            );
        }

        const articleData = await scrapeArticleContent(url)
        return NextResponse.json(articleData)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
