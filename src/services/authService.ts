import { getAuth, deleteUser, updatePassword, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface FirebaseError extends Error {
    code: string;
    message: string;

}

export const storeData = async (value: string) => {
    try {
        await AsyncStorage.setItem('@user_id', value)
    } catch (e) {
        console.error('Error storing data', e)
    }
}

export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await storeData(userCredential.user.uid);
    return userCredential;
  } catch (error) {
    const firebaseError = error as FirebaseError;
    console.error('Error Signing up:', firebaseError.message);
    throw firebaseError;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await storeData(userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    const firebaseError = error as FirebaseError;
    console.error('Error Logging In:', firebaseError.message);
    throw firebaseError;
  }
};

export const deleteAccount = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
        try {
            await user.delete();
            console.log('User deleted successfully');
        } catch (error) {
            console.error("Error deleting user account:", error);
            throw error;
        }
    } else {
        throw new Error("No user is currently signed in");
    }
};

export const changePassword = async (newPassword: string) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
        try {
            await updatePassword(user, newPassword);
        } catch (error: unknown) {
            const err = error as Error;
            throw new Error(err.message);
        }
    } else {
        throw new Error('No user is currently signed in.');
    }
};