import { Agenda } from 'agenda'
import dbConnect from './connection'

const agenda = new Agenda({ db: { address: process.env.MONGODB_URI } })

agenda.on('ready', () => {
    console.log('agenda is ready')
})

agenda.on('fail', (err, job) => {
    console.log(`job failed: ${job.attrs.name}`)
})

agenda.define('task reminder', async job => {
    console.log('sending task reminder')
    const { userId, taskContent } = job.attrs.data
    const subject = 'Task Reminder: You have an overdue task'
    const text = `Hello, \n\nYou have an overdue task: "${taskContent}".\nPlease complete it as soon as possible.`
  
  await sendEmail('user.email', subject, text)
})

export async function startScheduler() {
    await dbConnect()
    await agenda.start()
    await agenda.every('5 minutes', 'task reminder')
}