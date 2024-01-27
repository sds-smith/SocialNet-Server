import { coffees } from './coffees.mongo.js';

const DEFAULT_ID = 0;

export async function getCoffees() {
    const coffeesToReturn = await coffees.find({}); 
    return coffeesToReturn.reduce((obj, coffee) => ({
        ...obj,
        [coffee.id] : coffee
    }), {})
}

export async function getCoffeeById(id) {
    console.log('id', id)
    const foundCoffee =  await coffees.find({ id }); 
    console.log('foundCoffee', foundCoffee)
    return foundCoffee[0]
}

async function getNextCoffeeId() {
    const latestCoffee = await coffees
        .findOne()
        .sort('-id')
    if (!latestCoffee) {
        return DEFAULT_ID
    }
    return latestCoffee.id + 1
}

export async function createCoffee(coffeeToAdd) {
    const nextId = await getNextCoffeeId();
    const coffeeToCreate = {
        id: nextId,
        ...coffeeToAdd,
        createdAt: Date.now()
    };
    const newCoffee = new coffees(coffeeToCreate)
    try {
        const coffeeResponse = await newCoffee.save();
        return {
            ok: true,
            status: 201,
            coffee: coffeeResponse
        }
    } catch(err) {
        console.log(err)
        return err
    };
}