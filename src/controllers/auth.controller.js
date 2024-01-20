import { getUser } from "../models/auth.model.js";
import { getUser as mongoGetUser } from "../models/mongo/index.js"

export const httpGetUser = async (username) => await getUser(username);

export const httpGetGoogleUser = async (user) => await mongoGetUser(user);