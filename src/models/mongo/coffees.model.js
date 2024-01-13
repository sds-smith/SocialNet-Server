import { coffees } from './coffees.mongo.js';

// const DEFAULT_ID = 0;

export async function getCoffees() {
    const coffeesToReturn = await coffees.find({}); 
    return coffeesToReturn.reduce((obj, coffee) => ({
        ...obj,
        [coffee._id] : coffee
    }), {})
}

// async function getNextCheckinId() {
//     const latestCheckin = await checkins
//         .findOne()
//         .sort('-id')
//     if (!latestCheckin) {
//         return DEFAULT_ID
//     }
//     return latestCheckin.id + 1
// }

// export async function createCheckin(user, checkin) {
//     const nextId = await getNextCheckinId();
//     const checkinToCreate = {
//         id: nextId,
//         user,
//         checkin,
//         createdAt: Date.now()
//     };
//     const newCheckin = new checkins(checkinToCreate)
//     try {
//         const checkinResponse = await newCheckin.save();
//         return {
//             ok: true,
//             status: 201,
//             message: checkinResponse
//         }
//     } catch(err) {
//         console.log(err)
//         return err
//     };
// }