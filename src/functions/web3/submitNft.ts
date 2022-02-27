
import createNftSubmission from './createNftSubmission';

export async function main(event: any) {
    try {
        const body = JSON.parse(event.body)      
        return createNftSubmission(body)
    } catch (error) {
        console.error(`createNftSubmission error ${error}`);    

        return null;
    }
}