import { expressjwt } from 'express-jwt';
import jwt from 'jsonwebtoken';
import { getAuthUserById } from './util/firebase.js';

const secret = Buffer.from('+Z3zPGXY7v/0MoMm1p8QuHDGGVrhELGd', 'base64');

export const authMiddleware = expressjwt({
  algorithms: ['HS256'],
  credentialsRequired: false,
  secret,
});

export function decodeToken(token) {
  return jwt.verify(token, secret);
};

export async function handleLogin(req, res) {
  const userRequestingAuth = req.body;
  const authUser = await getAuthUserById(userRequestingAuth.uid)
  if (!authUser) {
    res.sendStatus(401);
  } else {
    const { displayName, photoURL, email, friends, uid } = authUser;
    const claims = { sub: {
      displayName,
      photoURL,
      email,
      friends,
      uid
    } };
    const token = jwt.sign(claims, secret);
    res.json({ token });  
  }
}