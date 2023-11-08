import OpenAI from 'openai'
import {ChatCompletionMessageParam} from "openai/resources"

import {get_encoding, encoding_for_model} from "tiktoken"
import Logger from "./utils/logger"

export async function generateJsonFromResume(resumeText: string): Promise<string | undefined> {
    const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY, timeout: 60000})
    const resumeMessages: ChatCompletionMessageParam[] = [{
        role: "system",
        content: `You are a programmatic resume parser who can parse the resume and create the JSON output from it. 
        You don't lose any information from original text. You will only receive resume text and respond with JSON and nothing else`
    }, {
        role: "user",
        content: resumeText
    }]
    const resumeJson = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: resumeMessages,



    })


    return resumeJson.choices[0].message.content || undefined

}


export async function inferJobDescription(description: string, additionalFields: string[]): Promise<string | undefined> {
    const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY, timeout: 60000})
    const originalPrompt = `I am a developer with 14+ years of experience. 
    You will assess a Job description and infer and extract following fields in JSON. 

- Company Name
- Job Title
- Type Of Job: Full time, part time or contract
- isRemote: Is the Job Remote?
- location: Leave blank if the job is remote. Or mention it in LOCATION NAME/HYBRID or FULL TIME format
- technicalSkills
- softSkills
- sugercoatingRating: Rate the following job according to how much it is sugar-coated. 1 if it isn't sugar-coated, 5 if it's full of sugar-coating. Focus only on soft skills and not on technical skills
- sugercoatingRatingReason: Give the reason for the bullshit rating. Also site the relevant text that helped you to calculate the rating`
    const prompt = additionalFields?.length ?? 0 > 0 ? `${originalPrompt}
    Also check for following data points: ${additionalFields.join(', ')}` : originalPrompt


    const jobDescriptionMessages: ChatCompletionMessageParam[] = [{
        role: "system",
        content: prompt
    }, {
        role: "user",
        content: description
    }]

    const tokens = await calculateTokens(jobDescriptionMessages)
    const modelLimit = modelLimits.find(modelLimit => modelLimit.name >= 'gpt-4')
    const modelLimitTokens = modelLimit?.limit ?? 0
    if (modelLimitTokens < tokens) {
        throw new Error(`Job description is too long. It has ${tokens} tokens, but the limit is ${modelLimit?.limit}`)
    }

    const jobDescriptionJson = await openai.chat.completions.create({
        model: 'gpt-4-1106-preview',
        messages: jobDescriptionMessages,
        response_format: {type: "json_object"},
        temperature: 0,
    })


    if (jobDescriptionJson.choices[0].finish_reason === 'function_call') {
        const jobDescriptionFuctionArgs = jobDescriptionJson.choices[0].message.function_call?.arguments

        return jobDescriptionFuctionArgs

    } else {

        return jobDescriptionJson.choices[0].message.content || undefined
    }
}

export async function checkCompatiblity(description: string, mainResume: string): Promise<string | undefined> {
    const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY, timeout: 60000})
    const compatibilityMessage: ChatCompletionMessageParam[] = [{
        role: "user",
        content: `You have two JSONs a Resume, and a JD.
        You need to check if the person is a good fit for the job or not. 
        Tell how much % is the match between the person and the job.State the reasons for your answer.
        Resume: ${mainResume}
        Job Description: ${description}`
    }]

    const tokens = await calculateTokens(compatibilityMessage)
    const modelLimit = modelLimits.find(modelLimit => modelLimit.name >= 'gpt-4')
    const modelLimitTokens = modelLimit?.limit ?? 0
    if (modelLimitTokens < tokens) {
        throw new Error(`Job description is too long. It has ${tokens} tokens, but the limit is ${modelLimit?.limit}`)
    }

    const matchJson = await openai.chat.completions.create({
        model: 'gpt-4-1106-preview',
        messages: compatibilityMessage,
        functions: [{
            name: 'getJobAnalysis',
            description: 'This function gets the Job output in JSON and processes it further',
            parameters: {
                "type": "object",
                "properties": {

                    "matchPercentage": {
                        "type": "number",
                        "description": "How much % is the match between the person and the job"
                    },
                    "matchReason": {
                        "type": "string",
                        "description": "Reason for match percentage"
                    },
                    "matchingSkills": {
                        "type": "object",
                        "properties": {
                            "technicalSkills": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                },
                                "description": "Technical skills from resume that makes the person a good fit for the job"
                            },
                            "softSkills": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                },
                                "description": "Soft skills from resume that makes the person a good fit for the job"
                            }
                        }
                    }
                },
                "required": ["matchPercentage", "matchReason", "matchingSkills"]

            }
        }]
    })


    if (matchJson.choices[0].finish_reason === 'function_call') {
        const matchFunctionArgs = matchJson.choices[0].message.function_call?.arguments

        return matchFunctionArgs

    } else {

        return matchJson.choices[0].message.content || undefined
    }
}

async function calculateTokens(messages: ChatCompletionMessageParam[]): Promise<number> {
    const chatMessages = messages.filter(message => message.content?.length ?? 0 > 0).map(message => message.content)
    const enc = await get_encoding("cl100k_base")
    const tokens = enc.encode(chatMessages.join('\n'))
    return tokens.length

}

const modelLimits = [
    {name: 'gpt-4', limit: 8000},
    {name: 'gpt-4-32k', limit: 32000},
    {name: 'gpt-3.5-turbo', limit: 4000},
    {name: 'gpt-3.5-turbo-16k', limit: 16000}
]