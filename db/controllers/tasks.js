import User from '../models/user'
import dbConnect from './util/connection'

export async function markTaskComplete(userId, taskId) {
    await dbConnect()
    const user = await User.findById(userId)
    if (!user) return null

    const task = user.tasks.map(task => task.findById(taskId))
    console.log(task)
    if (!task) {
        return null 
    } 

    task.markedComplete = true
    await user.save()

    return task
}

export async function getAllTasks(userId) {
    await dbConnect()
    const user = await User.findById(userId).lean()
    if(!user || !user.tasks) return []

    return (user.tasks || []).map((task) => ({
        _id: task._id,
        content: task.content,
        date: task.date,
        markedComplete: task.markedComplete
    }))
}

export async function addTask(userId, content, date) {
    await dbConnect()
    const user = await User.findById(userId)

    if(!user) return null
    if (!user.tasks) user.tasks = []

    const task = { content, date }
    user.tasks.push(task)
    await user.save()

    return task
}