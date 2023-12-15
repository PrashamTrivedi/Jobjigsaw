import OpenAI from 'openai'
import {ChatCompletionMessageParam} from "openai/resources"

import {get_encoding, encoding_for_model} from "tiktoken"
import Logger from "./utils/logger"

// Ensure this function is exported
export async function generateJsonFromResume(resumeText: string): Promise<string | undefined> {
    const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY, timeout: 60000})
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

- Company Name: Always use 'companyName' as key
- Job Title: Always use 'jobTitle' as key
- Type Of Job: Full time, part time or contract, always use 'typeOfJob' as key
- isRemote: Is the Job Remote?, always use 'isRemote' as key
- location: Leave blank if the job is remote. Or mention it in LOCATION NAME/HYBRID or FULL TIME format, always use 'location' as key
- technicalSkills, always use 'technicalSkills' as key
- softSkills, always use 'softSkills' as key
- sugercoatingRating: Rate the following job according to how much it is sugar-coated just to attract anyone and everyone. 1 if it isn't sugar-coated, 5 if it's full of sugar-coating. Focus only on soft skills and not on technical skills, always use 'sugercoatingRating' as key
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
        role: "system",
        content: `You have my resume in JSON format.And you will be given a JD.
        You need to check if I am a good fit for the job or not. 
        You will extract following fields in JSON.
        - matchPercentage: How much % is the match between my profile and the JD.
        - matchReason: State the reasons for your answer.
        - requiredSkills.softSkills: List of soft skills required in the JD that matches with my resume
        - requiredSkills.techSkills: List of tech skills required in the JD that matches with my resume
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

    const matchJson = await openai.chat.completions.create({
        model: 'gpt-4-1106-preview',
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

export async function generateResume(mainResume: string, jobCompatibilityData: string, generateCoverLetter: boolean): Promise<string | undefined> {
    const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY, timeout: 60000})
    // The prompt logic will be added later, for now it's an empty string
    const prompt = `You are a resume generator. You a have my resume in JSON format, and you will be given the job title, required tech skills and required soft skills in JSON format. You will modify the resume according to the data given to you. Your modification includes following things.
    - Change about section
    - Make required skills priority in the resume.
    - If a skill required is not there in resume, highlight adjacent skills which are there in the resume. for example when required skills have MySQL, highlight Postgres. When required skills have Google Cloud, highlight AWS. 
    - Do not add new skill in the resume at all.
    - Drop any skills from resume which are not in the required skills and may actually hurt my job application
    -  Each item in work experience must include 3-5 responsibilities and each responsibility should be 150-300 words long.
    - When altering the work experience, take care of the role and original responsibilities. You can alter some words that highlight the skills, but can't change meaning entirely, e.g. Can not add any AWS skills when my title involved Android. 
    - If a responsibility doesn't highlight required skill, leave it as it is.
    ${generateCoverLetter ? `- I need a cover letter for this job. I came to know about this job from LinkedIn, add this as coverLetter key in JSON` : ``} 

    Do not lie, when you add a new skill which is not in resume or change the meaning of responsibility heavily, that will be lying. 
    Give the output in JSON format
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

    const resumeJson = await openai.chat.completions.create({
        model: 'gpt-4-1106-preview',
        messages: resumeMessages,
        response_format: {type: "json_object"},
        temperature: 0,
    })

    // Handle the JSON response from the API
    return resumeJson.choices[0].message.content || undefined
}
