import OpenAI from 'openai'
import {ChatCompletion, ChatCompletionChunk, ChatCompletionMessageParam} from "openai/resources"

import {get_encoding} from "tiktoken"

import {Stream} from "openai/streaming"

// Ensure this function is exported
export async function generateJsonFromResume(resumeText: string, useOpenAi: boolean = true): Promise<string | undefined> {
    const openai = getOpenAiClient(useOpenAi)
    const resumeMessages: ChatCompletionMessageParam[] = [{
        role: "system",
        content: `You are a programmatic resume parser who can parse the resume and create the JSON output from it. 
        You don't lose any information from original text. You will only receive resume text and respond with JSON and nothing else. You will provide following fields from the resume.
        - contactDetails: {name, email, phone, address, linkedin, github, website}
        - about: {summary, highlights}
        - skills: Which is an array with following fields: name and items which shoud be array of strings
        - certifications: Array of name and lin
        - education: {degree, institution, location, duration}
        - workExperience: {role, company, location, duration, responsibilities}
        - projects: {name, description, duration, techStack, responsibilities, link}

        If you don't find any of the above fields, remove it from the JSON.
        `
    }, {
        role: "user",
        content: resumeText
    }]
    const model = await getModel(useOpenAi)
    const resumeJson = await openai.chat.completions.create({
        model,
        response_format: {type: "json_object"},
        temperature: 0,
        messages: resumeMessages,



    })


    return resumeJson.choices[0].message.content || undefined

}

async function getModel(useOpenAi: boolean = true): Promise<string> {
    const openai = getOpenAiClient(useOpenAi)
    if (useOpenAi) {
        const models = await openai.models.list()
        const gpt4 = models.data.find(model => model.id === process.env.DEFAULT_OPENAI_MODEL ?? 'gpt-4-1106-preview')
        if (gpt4) {
            return gpt4.id
        } else {
            return models.data.find(model => model.id === 'gpt-3.5-turbo')?.id ?? 'gpt-3.5-turbo'
        }
    } else {
        return Promise.resolve(process.env.OPTIONAL_MODEL ?? "meta-llama/llama-2-13b-chat")
    }
}


function getOpenAiClient(useOpenAi: boolean = true): OpenAI {

    if (!useOpenAi) {

        return new OpenAI({
            apiKey: process.env.OPENROUTER_API_KEY,
            baseURL: process.env.OPENROUTER_API_URL,
            timeout: 60000,
        })
    }
    return new OpenAI({apiKey: process.env.OPENAI_API_KEY, timeout: 60000})
}

export async function inferJobDescription(description: string, additionalFields: string[], useOpenAi: boolean = true): Promise<string | undefined> {
    const openai = getOpenAiClient(useOpenAi)
    const originalPrompt = `I am a developer with 14+ years of experience. 
    You will assess a Job description and infer and extract following fields in JSON. 
    Unless specified otherwise, all fields should be string

- Company Name: Always use 'companyName' as key
- Job Title: Always use 'jobTitle' as key
- Type Of Job: Full time, part time or contract, always use 'typeOfJob' as key
- isRemote: Is the Job Remote?, always use 'isRemote' as key. This should be a boolean
- location: Leave blank if the job is remote. Or mention it in LOCATION NAME/HYBRID or FULL TIME format, always use 'location' as key
- technicalSkills, always use 'technicalSkills' as key. This should be a string array
- softSkills, always use 'softSkills' as key. This should be a string array
- sugercoatingRating: Rate the following job according to how much it is sugar-coated just to attract anyone and everyone. 1 if it isn't sugar-coated, 5 if it's full of sugar-coating. Focus only on soft skills and not on technical skills, always use 'sugercoatingRating' as key. This should be a number.
- sugercoatingRatingReason: Give the reason for the bullshit rating. Also site the relevant text that helped you to calculate the rating. always use 'sugercoatingRatingReason' as key`
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
    const model = await getModel(useOpenAi)
    const jobDescriptionJson = await openai.chat.completions.create({
        model,
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

export async function checkCompatiblity(description: string, mainResume: string, useOpenAi: boolean = true): Promise<string | undefined> {
    const openai = getOpenAiClient(useOpenAi)
    const compatibilityMessage: ChatCompletionMessageParam[] = [{
        role: "system",
        content: `You have my resume in JSON format.And you will be given a JD.
        You need to check if I am a good fit for the job or not.
        You will extract following fields in JSON. All fields should be string unless specified otherwise.
        - matchPercentage: How much % is the match between my profile and the JD. This should be a number.
        - matchReason: State the reasons for your answer. This should be a string.
        - requiredSkills.softSkills: List of soft skills required in the JD that matches with my resume. This should be a string array.
        - requiredSkills.techSkills: List of tech skills required in the JD that matches with my resume. This should be a string array.
        Resume: ${mainResume}`
    }, {
        role: "user",
        content: description

    }]


    const tokens = await calculateTokens(compatibilityMessage)
    const modelLimit = modelLimits.find(modelLimit => modelLimit.name >= 'gpt-4')
    const modelLimitTokens = modelLimit?.limit ?? 0
    if (modelLimitTokens < tokens) {
        throw new Error(`Job description is too long. It has ${tokens} tokens, but the limit is ${modelLimit?.limit}`)
    }
    const model = await getModel(useOpenAi)
    const matchJson = await openai.chat.completions.create({
        model,
        messages: compatibilityMessage,
        response_format: {type: "json_object"},
        temperature: 0,
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

export async function generateResume(mainResume: string, jobCompatibilityData: string, generateCoverLetter: boolean, isStreaming: boolean, useOpenAi: boolean = true): Promise<string | undefined | Stream<ChatCompletionChunk>> {
    const openai = getOpenAiClient(useOpenAi)
    // The prompt logic will be added later, for now it's an empty string
    const prompt = `You are a resume generator. You will have my resume, required tech skills, and required soft skills in JSON format. Optionally you have match percentage, match reason and job title. 
    Your job is to create a customised resume from my main resume that will help me to move past Application Tracking System. 
    Here you will modify skills, workExperience and Projects sections of the resume.
    When customising resume, make sure you follow these points.
    - If a required tech skill is in the resume, move it first in its relevant section.
    - When a required skill isn't present in resume, move adjacent skills after required skills, like showcasing Postgres for MySQL or AWS for Google or Azure is required.
    - Do not add new skills to the resume.
    - Remove any skill that might hurt my job application.
    - Don't include any project where I have worked on a skill that is not required for the job.
    - Ensuring each work experience item has 3-5 responsibilities, each detailed in 150-300 words, framed as achievements or tasks benefited business directly.
    - If a responsibility doesn't highlight a required skill, leave it as it is.
    - Strictly avoid any fabrication or exaggeration.
    - Give the output in JSON format.
    - Keep the skills, workExperience and Projects in the same shape as in the main resume.
    ${generateCoverLetter ? `-Generate a cover letter for this Job, use coverLetter key in the response
Resume:, add this as coverLetter key in JSON` : ``} 
    Resume: ${mainResume}`

    const resumeMessages: ChatCompletionMessageParam[] = [{
        role: "system",
        content: prompt
    }, {
        role: "user",
        content: jobCompatibilityData
    }]
    const tokens = await calculateTokens(resumeMessages)
    const modelLimit = modelLimits.find(modelLimit => modelLimit.name >= 'gpt-4')
    const modelLimitTokens = modelLimit?.limit ?? 0
    if (modelLimitTokens < tokens) {
        throw new Error(`Job description is too long. It has ${tokens} tokens, but the limit is ${modelLimit?.limit}`)
    }
    // Additional logic for generating a cover letter can be added here based on the generateCoverLetter parameter
    const model = await getModel(useOpenAi)
    const resumeJson = await openai.chat.completions.create({
        model,
        messages: resumeMessages,
        response_format: {type: "json_object"},
        temperature: 0,
        stream: isStreaming
    })

    if (!isStreaming) {
        // Handle the JSON response from the API
        return (resumeJson as ChatCompletion).choices[0].message.content || undefined
    } else {
        return resumeJson as Stream<ChatCompletionChunk>
    }
}
