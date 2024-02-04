import { toasts } from "./toasts.mongo.js";
import { getUserById } from "../../util/firebase.js";

const DEFAULT_ID = 0;

async function getToastUser(uid) {
    const { displayName, email, photoURL } = await getUserById(uid);
    return { displayName, email, photoURL };
};

export async function getToasts(checkinId) {
    const foundToasts = await toasts.find({ checkinId }); 

    const toastUserPromises = foundToasts.map(async (toast) => await getToastUser(toast.user));
    const usersResponse = await Promise.allSettled(toastUserPromises);

    return foundToasts.map((toast, index) => ({
        id: toast.id,
        user: usersResponse[index].value,
        checkinId: toast.checkinId,
        createdAt: toast.createdAt
    }));
}

async function getNextToastId() {
    const latestToast = await toasts
        .findOne()
        .sort('-id')
    if (!latestToast) {
        return DEFAULT_ID
    }
    return latestToast.id + 1
}

export async function createToast(user, checkinId) {
    const nextId = await getNextToastId();
    const toast = {
        id: nextId,
        user,
        checkinId: Number(checkinId),
        createdAt: Date.now()
    };
    const newToast = new toasts(toast)
    try {
        const toastResponse = await newToast.save();
        const toastUser = await getToastUser(toastResponse.user)
        return {
            ok: true,
            status: 201,
            toast: {
                id: toastResponse.id,
                checkinId: toastResponse.checkinId,
                createdAt: toastResponse.createdAt,
                user: toastUser
            }
        }
    } catch(err) {
        console.log(err)
        return err
    };
}