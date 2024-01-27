import { checkins } from './checkins.mongo.js';
import { getCoffees, getCoffeeById } from './coffees.model.js';
import { getUserByEmail } from './user.model.js';

const DEFAULT_ID = 0;

async function getCheckinUser(userEmail) {
    const { displayName, email, photoURL } = await getUserByEmail(userEmail);
    return { displayName, email, photoURL };
};

export async function getCheckins() {
    const checkinsResponse = await checkins.find({}).sort({ createdAt: 'desc' }); 

    const checkinUserPromises = checkinsResponse.map(async (checkin) => await getCheckinUser(checkin.user));
    const checkinCoffeePromises = checkinsResponse.map(async (checkin) => await getCoffeeById(Number(checkin.coffeeID)));

    const usersResponse = await Promise.allSettled(checkinUserPromises);
    const coffeesResponse = await Promise.allSettled(checkinCoffeePromises);

    return checkinsResponse.map((checkin, index) => ({
        id: checkin.id,
        imageUrl: checkin.imageUrl,
        userNotes: checkin.userNotes,
        createdAt: checkin.createdAt,
        user: usersResponse[index].value,
        coffee: coffeesResponse[index].value
    }));
}

async function getNextCheckinId() {
    const latestCheckin = await checkins
        .findOne()
        .sort('-id')
    if (!latestCheckin) {
        return DEFAULT_ID
    }
    return latestCheckin.id + 1
}

export async function createCheckin(user, checkin) {
    const nextId = await getNextCheckinId();
    const checkinToCreate = {
        ...checkin,
        id: nextId,
        user,
        createdAt: Date.now()
    };
    const newCheckin = new checkins(checkinToCreate)
    try {
        const coffees = await getCoffees();
        const checkinResponse = await newCheckin.save();
        return {
            ok: true,
            status: 201,
            checkin: Object.assign(checkinResponse, {
                coffee: coffees[checkin.coffeeID]
            })
        }
    } catch(err) {
        console.log(err)
        return err
    };
}