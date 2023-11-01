import {Database} from 'sqlite'

interface Resume {
    text: string
}
export class MainResumeModel {



    constructor(private readonly db: Database) { }

    async getMainResume(): Promise<Resume> {
        const mainResume = await this.db.all<Resume[]>('SELECT text FROM mainResume')
        return JSON.parse(mainResume.map((resume) => resume.text)[0])
    }

    async updateMainResume(mainResume: string): Promise<void> {
        await this.db.run('UPDATE mainResume SET text = ?', mainResume)
    }


    async setMainResume(mainResume: string): Promise<void> {
        await this.db.run('DELETE FROM mainResume')
        await this.db.run('INSERT INTO mainResume (text) VALUES (?)', mainResume)
    }
}
