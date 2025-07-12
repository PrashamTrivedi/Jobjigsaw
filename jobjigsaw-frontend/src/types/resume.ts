export interface Resume {
    basics: {
        name: string;
        label: string;
        email: string;
        phone: string;
        url: string;
        summary: string;
        location: {
            address: string;
            postalCode: string;
            city: string;
            countryCode: string;
            region: string;
        };
        profiles: {
            network: string;
            username: string;
            url: string;
        }[];
    };
    workExperience: {
        company: string;
        position: string;
        website: string;
        startDate: string;
        endDate: string;
        summary: string;
        highlights: string[];
    }[];
    education: {
        institution: string;
        area: string;
        studyType: string;
        startDate: string;
        endDate: string;
        gpa: string;
        courses: string[];
    }[];
    awards: {
        title: string;
        date: string;
        awarder: string;
        summary: string;
    }[];
    skills: {
        name: string;
        level: string;
        keywords: string[];
    }[];
    languages: {
        language: string;
        fluency: string;
    }[];
    interests: {
        name: string;
        keywords: string[];
    }[];
    references: {
        name: string;
        reference: string;
    }[];
    projects: {
        name: string;
        description: string;
        highlights: string[];
        url: string;
    }[];
    certifications: string[];
}

export interface Skills {
    name: string;
    items: string[];
}

export interface WorkExperience {
    company: string;
    position: string;
    website: string;
    startDate: string;
    endDate: string;
    summary: string;
    highlights: string[];
}

export interface Project {
    name: string;
    description: string;
    highlights: string[];
    url: string;
}
