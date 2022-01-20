import createSubmission from "./createSubmission";

export async function main(event: any) {
    try {
        const submission = JSON.parse(event.body)
        
        return createSubmission(submission)
    } catch (error) {
        console.error(error);    

        return null;
    }
}