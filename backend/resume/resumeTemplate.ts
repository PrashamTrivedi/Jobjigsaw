import {Resume, mainResume} from "../mainResume"

class ResumeTemplate {
    private resumeData: Resume

    constructor(resumeData: Resume = mainResume) {
        this.resumeData = resumeData
    }

    public renderContactDetails(): string {
        const {name, email, phone, website, github, linkedin} = this.resumeData.contactDetails
        return `
        <section class="text-center mb-6 py-2">
            <h2 class="text-3xl font-bold">${name}</h2>
            <div class="flex justify-center space-x-4 mt-2">
                <span>Phone: ${phone}</span>
                <span><a href="mailto:${email}" class="text-blue-600">${email}</a></span>
            </div>
            
            <div class="flex justify-center space-x-4 mt-2">
                <span><a href="${website}" class="text-blue-600">Website</a></span>
                <span><a href="${github}" class="text-blue-600">Github</a></span>
                <span><a href="${linkedin}" class="text-blue-600">LinkedIn</a></span>
            </div>
        </section>
        `.trim()
    }

    public renderEducation(): string {
        return `
        <section class="mb-6 py-2">
            <h2 class="text-xl font-semibold mb-2">Education</h2>
            ${this.resumeData.education.map(edu => `
                
                <strong>${edu.degree}</strong>, ${edu.institution}
                <p class="text-slate-700 text-sm">${edu.duration}, ${edu.location}</p>
                `).join('')}
        </section>
        `.trim()
    }

    public renderCertifications(): string {
        return `
        <section class="mb-6 py-2">
            <h2 class="text-xl font-semibold mb-2">Certifications</h2>
            <ul class="list-disc pl-5">
                ${this.resumeData.certifications.map(cert => `<li class="ml-5">${cert}</li>`).join('')}
            </ul>
        </section>
        `.trim()
    }

    public renderSkills(): string {
        return `
        <section class="mb-6 py-2">
            <h2 class="text-xl font-semibold mb-2">Skills</h2>
            <ul class="list-disc pl-5">
            ${this.resumeData.skills.map(skill => `
                <li class="ml-5">
                    <strong>${skill.name}</strong>: 
                        ${skill.items.join(', ')}
                </li>
            `).join('')}
            </ul>
        </section>
        `.trim()
    }

    public renderWorkExperience(): string {
        return `
        <section class="mb-6 py-2">
            <h2 class="text-xl font-semibold mb-2">Work Experience</h2>
            ${this.resumeData.workExperience.map(exp => `
                <div class="py-2">
                    <h3>${exp.role} - <strong>${exp.company}</strong></h3>
                    <p class="text-slate-700 text-sm">Duration: ${exp.duration}</p>
                    <ul class="list-disc pl-5">
                        ${exp.responsibilities.map(responsibility => `<li class="ml-5">${responsibility}</li>`).join('')}
                    </ul>
                </div>
            `).join('')}
        </section>
        `.trim()
    }

    public renderProjects(): string {
        return `
        <section class="mb-6 py-2">
            <h2 class="text-xl font-semibold mb-2">Projects</h2>
            ${this.resumeData.projects.map(project => `
                <div class="py-2">
                    <h3><strong>${project.name}</strong></h3>
                    <p class="text-slate-700 text-sm">${project.duration}</p>
                    <p><strong>Description</strong>: ${project.description}</p>
                    <p><strong>Tech Stack:</strong> ${project.techStack.join(', ')}</p>
                    ${project.url ? `<p><strong>URL:</strong> <a href="${project.url}" class="text-blue-600">${project.url}</a></p>` : ''}
                    ${project.responsibilities ? `<ul class="list-disc pl-5">${project.responsibilities.map(responsibility => `<li class="ml-5">${responsibility}</li>`).join('')}</ul>` : ''}
                </div>
            `).join('')}
        </section>
        `.trim()
    }

    public renderAboutMe(): string {
        const {summary} = this.resumeData.about
        return `
        <section class="mb-6 py-2">
            <h2 class="text-xl font-semibold mb-2">About Me</h2>
            <p>${summary}</p>
        </section>
        `.trim()
    }

    // Methods for other sections will also use data from this.resumeData

    public renderCompleteResume(): string {

        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Complete Resume</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <!-- Add any additional head content such as stylesheets here -->
        </head>
        <body class="bg-gray-100 p-5">
            <div class="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
                ${this.renderContactDetails()}
                ${this.renderAboutMe()}
                ${this.renderSkills()}
                ${this.renderCertifications()}
                ${this.renderEducation()}
                ${this.renderWorkExperience()}
                ${this.renderProjects()}
            </div>
        </body>
        </html>
        `.trim()
    }
}

export default ResumeTemplate

