import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport('SMTP', {
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
})

export const sendEmail = async (to, subject, text, html = '') => {
    try{
        const mailOptions = {
            from: `"Self-Care App" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html
        }

        await transporter.sendMail(mailOptions)
        console.log('email send successfully')
    } catch (err) {
        console.error('Error sending email: ', err.message)
        throw new Error('unable to send email')
    }
}