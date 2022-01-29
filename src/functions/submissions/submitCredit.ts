
import sgMail from '@sendgrid/mail';

export async function main(event: any) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

    try {
        const { username, songUrl, loopUrl} = JSON.parse(event.body)

        const msg = {
        to: ['obartondev@gmail.com', 'info@wholooped.com', 'dwoobusiness@gmail.com'],
        from: 'info@wholooped.com', // Use the email address or domain you verified above
        subject: `New credit submission from ${username}`,
        text: 'and easy to do anywhere, even with Node.js',
        html: `
        <strong>Submitted By</strong> ${username}<br />
        <strong>Song Url</strong> <a href="${songUrl}">${songUrl}</a><br />
        <strong>Loop Url</strong> <a href="${loopUrl}">${loopUrl}</a><br />
        `,
        };
        
        //ES6
        sgMail
        .sendMultiple(msg)
        .then(() => {
            console.log('Email sent')
        })

    } catch (error) {
        console.error(error);    

        return null;
    }
}