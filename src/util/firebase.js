import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const app = initializeApp({
    credential: applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });

export async function getAuthUserById(uid) {
    return new Promise((resolve, reject) => {
        getAuth().getUser(uid)
            .then((userRecord) => {
              resolve(userRecord.toJSON())
            })
            .catch((error) => {
              console.log('Error fetching user data:', error);
              reject(error)
            });
    })
}