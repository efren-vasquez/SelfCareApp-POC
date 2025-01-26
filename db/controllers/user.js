import User from '../models/user'
import dbConnect from './util/connection'

export async function create (firstName, lastName, email, phoneNumber, password) {
    if (!(firstName && lastName && email && phoneNumber && password ))
        throw new Error('Must include first name, last name, email, phone number, and password')
    await dbConnect()

    const user = await User.create({firstName, lastName, email, phoneNumber, password})

    if (!user)
        throw new Error('Error creating User')

    return user.toJSON()
}