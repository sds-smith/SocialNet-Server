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
  const googleUser = req.body;
  const userResponse = await getAuthUserById(googleUser.uid)
  if (!userResponse) {
    res.sendStatus(401);
  } else {
    const { displayName, photoURL, email } = userResponse;
    const claims = { sub: {
      displayName,
      photoURL,
      email
    } };
    const token = jwt.sign(claims, secret);
    res.json({ token });  
  }
}