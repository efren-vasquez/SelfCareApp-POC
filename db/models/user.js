import { Schema, model, models } from "mongoose";
import bcrypt from 'bcrypt'

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 200
    }
})

UserSchema.pre('save', async function(next) {
    if (this.isNew)
        this.password = await bcrypt.hash(this.password, 10)
    next()
})

export default models.User || model('User', UserSchema)