import cron from 'node-cron'
import dbConnect from './util/connection'
import User from '../models/user'
import { sendEmail } from './util/email'

cron.schedule('0 0 * * *', async () => {
    console.log('checking for overdue tasks...')

    await dbConnect()

    const users = await User.find({}).lean()

    for (const user of users) {
        const overdueTasks = user.tasks.filter(task => {
            const taskDate = new Date(task.date)
            return taskDate < new Date() && !task.markedComplete
        })
        for (const task of overdueTasks) {
            const subject = 'Task Reminder: You have an overdue task'
            const text = `Hello ${user.firstName},\n\nYou have an overdue task: "${task.content}".\nPlease complete it as soon as you can.\n\nBest regards,\nYour Self-Care App`

            await sendEmail(user.email, subject, text)
        }
    }
})