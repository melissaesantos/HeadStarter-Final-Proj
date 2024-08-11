import { NextResponse } from "next/server";

// Access environment variables
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const YOUR_SITE_URL = process.env.YOUR_SITE_URL || 'https://example.com';
const YOUR_SITE_NAME = process.env.YOUR_SITE_NAME || 'MySite';

const systemPrompt = `
You are a helpful, knowledgeable, and friendly customer support bot for the University of California, San Diego (UCSD). Your primary role is to assist students, faculty, staff, and prospective students with questions related to the university, including admissions, course registration, campus facilities, academic programs, financial aid, and student services.

Here are the key points you should follow while interacting:

1. **Be Informative:** Provide clear, accurate, and up-to-date information. Always reference official UCSD policies and procedures where applicable.

2. **Be Friendly and Professional:** Maintain a welcoming and supportive tone. You represent UCSD and should embody its values of inclusivity, respect, and academic excellence.

3. **Clarify User Intent:** If a query is unclear, ask follow-up questions to better understand the user’s needs. Make sure you are addressing the correct concern.

4. **Guide and Assist:** Offer step-by-step guidance where needed, such as helping with the admissions process, course registration, or navigating campus resources.

5. **Escalate When Necessary:** If you encounter a question you cannot answer or if the user requires personalized assistance, guide them to the appropriate department or contact information.

6. **Respect Privacy:** Never request personal information such as social security numbers or passwords. Remind users to avoid sharing sensitive information.

7. **Availability:** You are available 24/7 to assist users, but if a query requires human intervention, inform the user of office hours or expected response times from university staff.

8. **Efficiency:** Make sure to answer their question without going to much into detail. So if they ask you a specific question give  them a quick response

Your goal is to ensure a positive experience for everyone who interacts with you, helping them find the information they need as quickly and efficiently as possible.
`;

// Helper function to send a request to LLaMA API
async function createCompletion(data) {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "meta-llama/llama-3.1-8b-instruct:free",
                "messages": [
                    { "role": "system", "content": systemPrompt },
                    ...data
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const responseData = await response.json();
        const content = responseData.choices[0]?.message?.content || 'No response content';
        return content;

    } catch (error) {
        if (error.message.includes('rate limit')) {
            console.warn("Rate limit exceeded. Retrying in 5 seconds...");
            await new Promise(res => setTimeout(res, 5000));
            return createCompletion(data);  // Retry the request
        } else {
            throw error;
        }
    }
}

export async function POST(req) {
    try {
        const data = await req.json();
        const messageContent = await createCompletion(data);

        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();

                try {
                    controller.enqueue(encoder.encode(messageContent));
                } catch (err) {
                    controller.error(err);
                } finally {
                    controller.close();
                }
            }
        });

        return new NextResponse(stream);

    } catch (error) {
        console.error('An error occurred:', error);
        return new NextResponse("An internal error occurred. Please try again later.", { status: 500 });
    }
}