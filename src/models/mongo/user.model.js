import { users } from './user.mongo.js';

export async function getUserByEmail(email) {
    const userByEmail = await users.find({ email }); 
    if (userByEmail?.length) return userByEmail[0];
    console.log('User not found')
}

export async function getUser(userInput) {
    const existingUser = await getUserByEmail(userInput.email); 
    if (existingUser) return existingUser;

    return await createUser(userInput);
}

export async function createUser(userInput) {
    const newUser = new users(userInput)
    try {
        const userResponse = await newUser.save();
        return {
            ok: true,
            status: 201,
            user: userResponse
        }
    } catch(err) {
        console.log(err)
        return err
    };
}