import { checkins } from '../data/mock-data.js';
import { getCoffees } from './mongo/coffees.model.js';

export async function getCheckins() {
    const coffees = await getCoffees();
    return Object.values(checkins).map(checkin => ({
        ...checkin,
        coffee: coffees[checkin.coffeeID]
    }));
}