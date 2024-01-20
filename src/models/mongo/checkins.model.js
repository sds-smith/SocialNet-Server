import { checkins } from './checkins.mongo.js';
import { getCoffees } from './coffees.model.js';

const DEFAULT_ID = 0;

export async function getCheckins() {
    const coffees = await getCoffees();
    const checkinsResponse = await checkins.find({}).sort({ createdAt: 'desc' }); 

    return checkinsResponse.map(checkin => (
        Object.assign(checkin, {
            coffee: coffees[checkin.coffeeID]
        })
    ));
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