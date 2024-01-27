import { users } from './user.mongo.js';

export async function getUser(userInput) {
    const existingUser = await users.find({ email: userInput.email }); 
    if (existingUser?.length) return existingUser[0];

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