import { NextResponse } from "next/server";
import OpenAI from "openai";

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

Your goal is to ensure a positive experience for everyone who interacts with you, helping them find the information they need as quickly and efficiently as possible.
`;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function createCompletion(data) {
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                ...data,
            ],
            model: 'gpt-3.5',
            stream: true,
        });

        return completion;
    } catch (error) {
        if (error.code === 'rate_limit_exceeded') {
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
        const completion = await createCompletion(data);

        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();

                try {
                    for await (const chunk of completion) {
                        const content = chunk.choices[0]?.delta?.content;
                        if (content) {
                            const text = encoder.encode(content);
                            controller.enqueue(text);
                        }
                    }
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
 