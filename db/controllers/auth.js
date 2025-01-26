import { compare } from 'bcrypt'
import User from '../models/user'
import dbConnect from './util/connection'

export async function login(email, password) {
    if(!(email && password)) 
        throw new Error('Must include email and password')

    await dbConnect()
    const user = await User.findOne({email}).lean()

    if (!user)
        throw new Error('User not found')

    const isPasswordCorrect = await compare(password, user.password)

    if (!isPasswordCorrect)
        throw new Error('Email or Password is incorrect')

    return user
}