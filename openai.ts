import OpenAI from 'openai'
import {ChatCompletionMessageParam} from "openai/resources"



export async function generateJsonFromResume(resumeText: string): Promise<string | undefined> {
    const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY, timeout: 60000})
    const resumeMessages: ChatCompletionMessageParam[] = [{
        role: "system",
        name: 'ResumeParser',
        content: `You are a programmatic resume parser who can parse the resume and create the JSON output from it. 
        You don't lose any information from original text. You will only receive resume text and respond with JSON and nothing else`
    }, {
        role: "user",
        name: 'Resume',
        content: resumeText
    }]
    const resumeJson = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: resumeMessages,



    })


    return resumeJson.choices[0].message.content || undefined

}

