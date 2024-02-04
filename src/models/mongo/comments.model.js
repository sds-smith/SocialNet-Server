import { comments } from "./comments.mongo.js";
import { getUserById } from "../../util/firebase.js";

const DEFAULT_ID = 0;

async function getCommentUser(uid) {
    const { displayName, email, photoURL } = await getUserById(uid);
    return { displayName, email, photoURL };
};

export async function getComments(checkinId) {
    const foundComments = await comments.find({ checkinId }); 

    const commentUserPromises = foundComments.map(async (comment) => await getCommentUser(comment.user));
    const usersResponse = await Promise.allSettled(commentUserPromises);

    return foundComments.map((foundComment, index) => ({
        id: foundComment.id,
        user: usersResponse[index].value,
        comment: foundComment.comment,
        checkinId: foundComment.checkinId,
        createdAt: foundComment.createdAt
    }));
}

async function getNextCommentId() {
    const latestComment = await comments
        .findOne()
        .sort('-id')
    if (!latestComment) {
        return DEFAULT_ID
    }
    return latestComment.id + 1
}

export async function createComment(user, {checkinId, comment}) {
    const nextId = await getNextCommentId();
    const commentToAdd = {
        id: nextId,
        user,
        comment,
        checkinId: Number(checkinId),
        createdAt: Date.now()
    };
    const newComment = new comments(commentToAdd)
    try {
        const commentResponse = await newComment.save();
        const commentUser = await getCommentUser(commentResponse.user)
        return {
            ok: true,
            status: 201,
            comment: {
                id: commentResponse.id,
                checkinId: commentResponse.checkinId,
                comment: commentResponse.comment,
                createdAt: commentResponse.createdAt,
                user: commentUser
            }
        }
    } catch(err) {
        console.log(err)
        return err
    };
}