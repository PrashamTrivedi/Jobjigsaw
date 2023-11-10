import {Resume, mainResume} from "../mainResume"

class ResumeTemplate {
    private resumeData: Resume

    constructor(resumeData: Resume = mainResume) {
        this.resumeData = resumeData
    }

    public renderContactDetails(): string {
        const {name, email, phone, website, github, linkedin} = this.resumeData.contactDetails
        return `
        <section class="text-center mb-6">
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
        <section class="education">
            <h2 class="text-xl font-semibold mb-2">Education</h2>
            ${this.resumeData.education.map(edu => `
                <div class="education-entry">
                    <p>Degree: ${edu.degree}</p>
                    <p>Institution: ${edu.institution}</p>
                    <p>Location: ${edu.location}</p>
                    <p>Duration: ${edu.duration}</p>
                </div>
            `).join('')}
        </section>
        `.trim()
    }

    public renderCertifications(): string {
        return `
        <section class="certifications">
            <h2 class="text-xl font-semibold mb-2">Certifications</h2>
            <ul class="list-disc pl-5">
                ${this.resumeData.certifications.map(cert => `<li>${cert}</li>`).join('')}
            </ul>
        </section>
        `.trim()
    }

    public renderSkills(): string {
        return `
        <section class="mb-6">
            <h2 class="text-xl font-semibold mb-2">Skills</h2>
            ${this.resumeData.skills.map(skill => `
                <div class="skill-entry">
                <ul class="list-disc pl-5">
                    <strong>${skill.name}</strong>: 
                        ${skill.items.join(', ')}
                    </ul>
                </div>
            `).join('')}
        </section>
        `.trim()
    }

    public renderWorkExperience(): string {
        return `
        <section class="work-experience">
            <h2 class="text-xl font-semibold mb-2">Work Experience</h2>
            ${this.resumeData.workExperience.map(exp => `
                <div class="work-experience-entry">
                    <h3>${exp.role} - ${exp.company}</h3>
                    <p>Duration: ${exp.duration}</p>
                    <ul class="list-disc pl-5">
                        ${exp.responsibilities.map(responsibility => `<li>${responsibility}</li>`).join('')}
                    </ul>
                </div>
            `).join('')}
        </section>
        `.trim()
    }

    public renderProjects(): string {
        return `
        <section class="projects">
            <h2 class="text-xl font-semibold mb-2">Projects</h2>
            ${this.resumeData.projects.map(project => `
                <div class="list-disc pl-5">
                    <h3>${project.name}</h3>
                    <p>Duration: ${project.duration}</p>
                    <p>Description: ${project.description}</p>
                    <p>Tech Stack: ${project.techStack.join(', ')}</p>
                    ${project.url ? `<p>URL: <a href="${project.url}" class="text-blue-600">${project.url}</a></p>` : ''}
                    ${project.responsibilities ? `<ul>${project.responsibilities.map(responsibility => `<li>${responsibility}</li>`).join('')}</ul>` : ''}
                </div>
            `).join('')}
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
