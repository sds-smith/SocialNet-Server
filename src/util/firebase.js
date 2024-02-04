import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import {Firestore} from '@google-cloud/firestore';

const app = initializeApp({
    credential: applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });

export const db = new Firestore();

export async function getAuthUserById(uid) {
  return new Promise((resolve, reject) => {
    getAuth().getUser(uid)
      .then(async (userRecord) => {
        const userDoc = await createUserDocumentFromAuth(userRecord, { friends: [] });
        resolve(userDoc.data())
      })
      .catch((error) => {
        console.log('Error fetching user data:', error);
        reject(error)
      });
  })
}

export const getUserById = async (uid) => {
  const userDocRef = db.doc(`users/${uid}`)
  const userSnap = await userDocRef.get();
  return userSnap.data();
}

export const createUserDocumentFromAuth = async (userAuth, additionalInformation = {}) => {
  if (!userAuth) return
  const userDocRef = db.doc(`users/${userAuth.uid}`)
  const userSnapshot = await userDocRef.get();
  if (!userSnapshot.exists) {
      const { displayName, uid, email, photoURL } = userAuth
      const createdAt = new Date()
      try {
          await userDocRef.set({
              displayName,
              uid,
              email,
              photoURL,
              createdAt,
              ...additionalInformation
          })
          return await userDocRef.get();
      } catch (error) {
          console.log('error creating the user', error)
      }
  }
  const authUser = userAuth.toJSON();
  if (userSnapshot.photoURL !== authUser.photoURL) {
    await userDocRef.update({
      photoURL: authUser.photoURL
    });
    return await userDocRef.get();
  }
  return userSnapshot;
}

// export const getUsers = async () => {
//   const collectionRef = collection(db, 'users')
//   const q = query(collectionRef)
//   const querySnapshot = await getDocs(q)
//   return querySnapshot.docs.map((docSnapshot) => docSnapshot.data())
// }

// export const updateUser = async (userId, updatedItems) => {
//   const userDocRef = doc(db, "users", userId);
//   await updateDoc(userDocRef, {
//     items: updatedItems
//   })
//   return await getUsers()
// }