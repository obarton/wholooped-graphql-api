import Submission from "../types/Submission";
import listSubmissions from "../functions/submissions/listSubmissions";
import createSubmission from "../functions/submissions/createSubmission";
import updateSubmission from "../functions/submissions/updateSubmission";
import deleteSubmission from "../functions/submissions/deleteSubmission";
import getSubmissionById from "../functions/submissions/getSubmissionById";

type AppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: {
    submission: Submission;
    submissionId: string;
    userId: string;
  };
};

export async function handler(
  event: AppSyncEvent
): Promise<Record<string, unknown>[] | Submission | string | null | undefined> {
  switch (event.info.fieldName) {
    case "listSubmissions":
      return await listSubmissions(event.arguments.userId);
    case "createSubmission":
      return await createSubmission(event.arguments.submission);
    case "updateSubmission":
      return await updateSubmission(event.arguments.submission);
    case "deleteSubmission":
      return await deleteSubmission(event.arguments.submissionId);
    case "getSubmissionById":
      return await getSubmissionById(event.arguments.submissionId);
    default:
      return null;
  }
}