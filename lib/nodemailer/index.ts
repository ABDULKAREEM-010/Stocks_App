import nodemailer from 'nodemailer';
import {WELCOME_EMAIL_TEMPLATE, NEWS_SUMMARY_EMAIL_TEMPLATE} from "@/lib/nodemailer/template";

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL!,
        pass: process.env.NODEMAILER_PASSWORD!,
    }
})

export const sendWelcomeEmail = async ({ email, name, intro }: WelcomeEmailData) => {
    // Validate inputs
    if (!email || typeof email !== 'string' || !email.trim()) {
        console.error('❌ Invalid email provided to sendWelcomeEmail:', email);
        throw new Error('Invalid email address provided');
    }
    
    if (!name || typeof name !== 'string' || !name.trim()) {
        console.error('❌ Invalid name provided to sendWelcomeEmail:', name);
        throw new Error('Invalid name provided');
    }

    console.log('✅ Preparing to send welcome email to:', email, 'Name:', name);

    const htmlTemplate = WELCOME_EMAIL_TEMPLATE
        .replace('{{name}}', name)
        .replace('{{intro}}', intro);

    const mailOptions = {
        from: `"Signalist" <${process.env.NODEMAILER_EMAIL}>`,
        to: email,
        subject: `Welcome to Signalist - your stock market toolkit is ready!`,
        text: 'Thanks for joining Signalist',
        html: htmlTemplate,
    }

    console.log('📧 Sending email with options:', {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject
    });

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully:', info.messageId);
        return info;
    } catch (error) {
        console.error('❌ Failed to send email:', error);
        throw error;
    }
}

export const sendNewsSummaryEmail = async (
    { email, date, newsContent }: { email: string; date: string; newsContent: string }
): Promise<void> => {
    const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE
        .replace('{{date}}', date)
        .replace('{{newsContent}}', newsContent);

    const mailOptions = {
        from: `"Signalist News" <signalist@mohammed.ak>`,
        to: email,
        subject: `📈 Market News Summary Today - ${date}`,
        text: `Today's market news summary from Signalist`,
        html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
};