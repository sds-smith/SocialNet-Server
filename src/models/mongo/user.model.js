import { users } from './user.mongo.js';

export async function getUser(uid) {
    return await users.find({ uid }); 
}

export async function createUser(userInput) {
    const existingUser = await getUser(userInput.uid);

    if (existingUser?.length) return {
        ok: true,
        status: 201,
        user: existingUser[0]
    }
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