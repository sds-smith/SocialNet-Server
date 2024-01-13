import { coffees, checkins } from '../data/mock-data.js';

export function getCheckins() {
    return Object.values(checkins).map(checkin => ({
        ...checkin,
        coffee: coffees[checkin.coffeeID]
    }));
}