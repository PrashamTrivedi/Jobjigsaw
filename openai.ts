import OpenAI from 'openai'
import {ChatCompletionMessageParam} from "openai/resources"

import {get_encoding, encoding_for_model} from "tiktoken"
import Logger from "./utils/logger"

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


export async function inferJobDescription(description: string, additionalFields: string[]): Promise<string | undefined> {
    const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY, timeout: 60000})
    const originalPrompt = `Here's a job description I found.
        Analyze it and tell me, the technical and soft skills required for this job. 
        Also give me following information in JSON so that I can process it further
        - Company Name
        - Job Title
        - Is the job is remote or not, if the job is not remote, give me the job location. 
        - Is the job is full time or part time.
        - Anything in the job description that seems too good to be true or overly positive. 
            Rate this on a scale of 1 to 5, 
            where 1 means the job description is realistic and straightforward, 
            and 5 means there's a lot of hype or unrealistic expectations.`
    const prompt = additionalFields?.length ?? 0 > 0 ? `${originalPrompt}
    Also check for following data points: ${additionalFields.join(', ')}` : originalPrompt


    const jobDescriptionMessages: ChatCompletionMessageParam[] = [{
        role: "user",
        name: 'JobDescription',
        content: description
    }]

    const tokens = await calculateTokens(jobDescriptionMessages)
    const modelLimit = modelLimits.find(modelLimit => modelLimit.name >= 'gpt-4')
    const modelLimitTokens = modelLimit?.limit ?? 0
    if (modelLimitTokens < tokens) {
        throw new Error(`Job description is too long. It has ${tokens} tokens, but the limit is ${modelLimit?.limit}`)
    }

    const jobDescriptionJson = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: jobDescriptionMessages,
        functions: [{
            name: 'getJobAnalysis',
            description: 'This function gets the Job output in JSON and processes it further',
            parameters: {
                "type": "object",
                "properties": {
                    "text": {
                        "type": "string"
                    },
                    "companyName": {
                        "type": "string"
                    },
                    "jobTitle": {
                        "type": "string"
                    },
                    "type": {
                        "type": "string",
                        "description": "Full time or part time"
                    },
                    "isRemote": {
                        "type": "boolean",
                    },
                    "location": {
                        "type": "string",
                        "description": "If the job is remote, then this field will be empty, otherwise location along with type in LOCATION (HYBRID/FULL TIME) format"
                    },
                    "technicalSkills": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },
                    "softSkills": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },
                    "hypeRating": {
                        "type": "number",
                        "description": "How much of this job description is too good to be true. 1 means clear job description, 5 means too much sugarcoating"
                    },
                    "hypeRatingReason": {
                        "type": "string",
                        "description": "Reason for hype rating"
                    }
                },
                "required": ["text", "url", "companyName", "post", "type", "location", "technicalSkills", "softSkills", "date", "hypeRating", "hypeRatingReason"]

            }
        }]
    })


    if (jobDescriptionJson.choices[0].finish_reason === 'function_call') {
        const jobDescriptionFuctionArgs = jobDescriptionJson.choices[0].message.function_call?.arguments
        const functionMessage: ChatCompletionMessageParam = {
            role: "function",
            name: 'getJobAnalysis',
            content: "That's it, thanks a lot"
        }
        jobDescriptionMessages.push(functionMessage)
        const jobDescriptionJsonPostFunction = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: jobDescriptionMessages,
            functions: [{
                name: 'getJobAnalysis',
                description: 'This function extracts the Job description from the input',
                parameters: {

                    "$schema": "http://json-schema.org/draft-07/schema#",
                    "type": "object",
                    "properties": {
                        "text": {
                            "type": "string"
                        },
                        "url": {
                            "type": "string"
                        },
                        "companyName": {
                            "type": "string"
                        },
                        "post": {
                            "type": "string"
                        },
                        "type": {
                            "type": "string"
                        },
                        "location": {
                            "type": "string"
                        },
                        "technicalSkills": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "softSkills": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "date": {
                            "type": "string"
                        },
                        "hypeRating": {
                            "type": "number"
                        },
                        "hypeRatingReason": {
                            "type": "string"
                        }
                    },
                    "required": ["text", "url", "companyName", "post", "type", "location", "technicalSkills", "softSkills", "date", "hypeRating", "hypeRatingReason"]

                }
            }]
        })
        Logger.info(`Job description JSON: ${JSON.stringify(jobDescriptionJsonPostFunction
            .choices[0].message.content)}`)

        return jobDescriptionFuctionArgs

    } else {

        return jobDescriptionJson.choices[0].message.content || undefined
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