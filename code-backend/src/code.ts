import fs from 'fs';
import util from 'util';
import { runCodeInContainer } from "./docker";

const writeFileAsync = util.promisify(fs.writeFile);

export const runCode = async (code: string): Promise<string> => {
    const filename = Date.now().toString();
    const filePath = `/Users/mohitsankhla/Projects/code-backend/code/${filename}.js`;

    try {
        // Write code to file
       
        // Run code in container
        return new Promise<string>((resolve, reject) => {
            runCodeInContainer(filename, (err: any, result: null | string) => {
                if (err) {
                    console.error(err);
                    reject(err);
                    return;
                }
                resolve(result || '');
            });
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
}
