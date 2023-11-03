import {Database} from 'sqlite'

interface Resume {
    text: string,
    resumeJson?: string
}
export class MainResumeModel {



    constructor(private readonly db: Database) { }

    async getMainResume(): Promise<Resume> {
        const mainResume = await this.db.all<Resume[]>('SELECT text,resumeJson FROM mainResume')
        return mainResume[0]
    }

    async updateMainResume(mainResume: string, resumeJson?: string): Promise<void> {
        await this.db.run('UPDATE mainResume SET text = ?, resumeJson = ?', mainResume, resumeJson)
    }


    async setMainResume(mainResume: string, resumeJson?: string): Promise<void> {
        await this.db.run('DELETE FROM mainResume')
        await this.db.run('INSERT INTO mainResume (text,resumeJson) VALUES (?,?)', mainResume, resumeJson)
    }
}
