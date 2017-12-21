import * as afs from 'async-file';

async function readFile(location: string): Promise<string> {
    return await afs.readFile(location, 'utf8');
}

export async function readJSON(location: string) {
    const data: string = await readFile(location);

    return JSON.parse(data);
}
