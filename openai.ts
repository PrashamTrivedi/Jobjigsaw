import OpenAI from 'openai'



export async function generateJsonFromResume(resumeText: string): Promise<string | null> {
    const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})
    const resumeJson = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{
            role: "system",
            name: 'ResumeParser',
            content: `You will have a resume text in next message, convert the resume to parsable JSON. Respond with JSON and nothing else`
        }, {
            role: "user",
            name: 'Resume',
            content: resumeText || ''
        }],

    })

    return resumeJson.choices[0].message.content

}

