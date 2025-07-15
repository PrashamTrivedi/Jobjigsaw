import OpenAI from 'openai'
import {ChatCompletion, ChatCompletionMessageParam} from "openai/resources"

import puppeteer from "@cloudflare/puppeteer"
import {GoogleGenerativeAI} from '@google/generative-ai'
import {search} from "./jina"


// Ensure this function is exported
export async function generateJsonFromResume(resumeText: string, env: Env,): Promise<string | undefined> {
    const {preferredModel: model, useOpenAi} = await getModel(env)
    if (useOpenAi) {
        const openai = await getOpenAiClient(env)
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
            model,
            response_format: {type: "json_object"},
            temperature: 0,
            messages: resumeMessages,
        })
        return resumeJson.choices[0].message.content || undefined
    } else {
        const gemini = await getGeminiClient(env)
        const geminiModel = gemini.getGenerativeModel({model})
        const prompt = `You are a programmatic resume parser who can parse the resume and create the JSON output from it. 
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
        const result = await geminiModel.generateContent([prompt, resumeText])
        const response = result.response
        return response.text()
    }
}

async function getModel(env: Env): Promise<{preferredModel: string, useOpenAi: boolean}> {
    const data = await env.AI_GATEWAY_KV.get<{preferredModel: string, useOpenAi: boolean}>("PREFERRED_MODEL",
        {
            type: 'json'
        }
    )

    return data ?? {preferredModel: "", useOpenAi: false}
}


async function getOpenAiClient(env: Env): Promise<OpenAI> {
    const apiKey = await env.OPENAI_API_KEY.get()
    return new OpenAI({
        apiKey,
        baseURL: `https://gateway.ai.cloudflare.com/v1/${env.CLOUDFLARE_ACCOUNT_ID}/jobjigsaw-openai/openai`,

    })
}

async function getGeminiClient(env: Env): Promise<GoogleGenerativeAI> {
    const apiKey = await env.OPENAI_API_KEY.get()
    return new GoogleGenerativeAI(apiKey ?? "")
}


export async function inferJobDescriptionFromUrl(url: string, env: Env) {
    const browser = await puppeteer.launch(env.BROWSER)
    const page = await browser.newPage()
    await page.goto(url, {
        waitUntil: "load"
    })
    // Get website text
    const renderedText = await page.evaluate(() => {
        // @ts-ignore js code to run in the browser context
        const body = document.querySelector("body")
        return body ? body.innerText : ""
    })
    // Close browser since we no longer need it
    await browser.close()
    return await inferJobDescription(renderedText, [], env)
}

export async function inferJobDescription(description: string, additionalFields: string[], env: Env): Promise<string | undefined> {
    const originalPrompt = `I am a developer with 16+ years of experience. 
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

    const {preferredModel: model, useOpenAi} = await getModel(env)
    if (useOpenAi) {
        const openai = await getOpenAiClient(env)
        const jobDescriptionMessages: ChatCompletionMessageParam[] = [{
            role: "system",
            content: prompt
        }, {
            role: "user",
            content: description
        }]


        const jobDescriptionJson = await openai.chat.completions.create({
            model,
            messages: jobDescriptionMessages,
            response_format: {type: "json_object"},
            temperature: 0,

        })

        return (jobDescriptionJson as ChatCompletion).choices[0].message.content || undefined

    } else {
        const gemini = await getGeminiClient(env)
        const geminiModel = gemini.getGenerativeModel({model}, {
            baseUrl: `https://gateway.ai.cloudflare.com/v1/${env.CLOUDFLARE_ACCOUNT_ID}/jobjigsaw-openai/google-ai-studio`,
        })
        const result = await geminiModel.generateContent([prompt, description])
        const response = result.response
        return response.text()
    }
}

export async function checkCompatiblity(description: string, mainResume: string, env: Env): Promise<string | undefined> {
    const compatibilityPrompt = `You have my resume in JSON format.And you will be given a JD.
        You need to check if I am a good fit for the job or not.
        You will extract following fields in JSON. All fields should be string unless specified otherwise.
        - matchPercentage: How much % is the match between my profile and the JD. This should be a number.
        - matchReason: State the reasons for your answer. This should be a string.
        - requiredSkills.softSkills: List of soft skills required in the JD that matches with my resume. This should be a string array.
        - requiredSkills.techSkills: List of tech skills required in the JD that matches with my resume. This should be a string array.
        Resume: ${mainResume}`

    const {preferredModel: model, useOpenAi} = await getModel(env)
    if (useOpenAi) {
        const openai = await getOpenAiClient(env)
        const compatibilityMessage: ChatCompletionMessageParam[] = [{
            role: "system",
            content: compatibilityPrompt
        }, {
            role: "user",
            content: description

        }]



        const matchJson = await openai.chat.completions.create({
            model,
            messages: compatibilityMessage,
            response_format: {type: "json_object"},
            temperature: 0
        })


        return (matchJson as ChatCompletion).choices[0].message.content || undefined

    } else {
        const gemini = await getGeminiClient(env)
        const geminiModel = gemini.getGenerativeModel({model})
        const result = await geminiModel.generateContent([compatibilityPrompt, description])
        const response = result.response
        return response.text()
    }
}





export async function generateResume(mainResume: string, jobCompatibilityData: string, generateCoverLetter: boolean, env: Env,): Promise<string | undefined> {
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
    ${generateCoverLetter ? `-Generate a cover letter for this Job, use coverLetter key in the response\nResume:, add this as coverLetter key in JSON` : ``} 
    Resume: ${mainResume}`

    const {preferredModel: model, useOpenAi} = await getModel(env)
    if (useOpenAi) {
        const openai = await getOpenAiClient(env)
        const resumeMessages: ChatCompletionMessageParam[] = [{
            role: "system",
            content: prompt
        }, {

            role: "user",
            content: jobCompatibilityData
        }]

        // Additional logic for generating a cover letter can be added here based on the generateCoverLetter parameter
        const resumeJson = await openai.chat.completions.create({
            model,
            messages: resumeMessages,
            response_format: {type: "json_object"},
            temperature: 0,

        })

        return (resumeJson as ChatCompletion).choices[0].message.content || undefined

    } else {
        const gemini = await getGeminiClient(env)
        const geminiModel = gemini.getGenerativeModel({model})
        const result = await geminiModel.generateContent([prompt, jobCompatibilityData])
        const response = result.response
        return response.text()
    }
}

export async function inferCompanyDetails(companyName: string, env: Env) {

    const companyProduct = search(`${companyName} product`, env)
    const companyFinancials = search(`${companyName} financials`, env)

    const companyTechStack = search(`${companyName} tech stack`, env)

    const companyBlog = search(`${companyName} blog`, env)

    const companyEmployees = search(`${companyName} people linkedin`, env)

    const results = await Promise.all([companyProduct, companyFinancials, companyTechStack, companyBlog, companyEmployees])

    interface SearchResult {
        title: string
        link: string
        snippet: string
    }

    const mapper = (result: SearchResult): string => (`title: ${result.title}, link: ${result.link}, 
    snippet: ${result.snippet}`)
    const companyDetails = {
        companyProduct: results[0],
        companyFinancials: results[1],
        companyTechStack: results[2],
        companyBlog: results[3],
        companyEmployees: results[4]
    }

    const prompt = `You are a company details summarizer. 
    You will be given company name, product details, financials, tech stack, blog and employees in JSON format.
    Your job is to summarize the details and give the proper response along with links. 
    Always link Blog and Employees to their respective links.`

    const {preferredModel: model, useOpenAi} = await getModel(env)
    if (useOpenAi) {
        const openai = await getOpenAiClient(env)
        const companyDetailsMessages: ChatCompletionMessageParam[] = [{
            role: "system",
            content: prompt
        }, {
            role: "user",
            content: `Company Name: ${companyName}, and details in json: ${JSON.stringify(companyDetails)}`
        }]


        const companyDetailsJson = await openai.chat.completions.create({
            model,
            messages: companyDetailsMessages,
            temperature: 0
        })

        return (companyDetailsJson as ChatCompletion).choices[0].message.content || undefined

    } else {
        const gemini = await getGeminiClient(env)
        const geminiModel = gemini.getGenerativeModel({model})
        const result = await geminiModel.generateContent([prompt, `Company Name: ${companyName}, and details in json: ${JSON.stringify(companyDetails)}`])
        const response = result.response
        return response.text()
    }
}