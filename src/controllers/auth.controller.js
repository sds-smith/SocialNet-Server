import { getUser } from "../models/auth.model.js";

export const httpGetUser = async (username) => await getUser(username);