import { Schema } from 'mongoose'

const TaskSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true
    },
    markedComplete: {
        type: Boolean,
        default: false
    }
})

export default TaskSchema