import Interaction from "../../types/Interaction";

export default async function sendInteraction(
    interaction: Interaction
): Promise<any> {

    console.log(`sendInteraction sending interaction ${JSON.stringify(interaction, null, 2)}`);

    return interaction;
}