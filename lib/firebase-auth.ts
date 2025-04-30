import { Auth, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,signOut as firebaseSignOut} from "firebase/auth";
import { formatPhoneNumber, isEmail, isPhone } from "./validation";
import { getFirebaseErrorMessage } from "./error-handling";
import { auth, db } from "@/FirebaseConfig";
import { doc, setDoc, getDoc, serverTimestamp  } from "firebase/firestore";
type AuthError = {
    code: string;
    message: string;
}
type AuthResult<T> = {
    success: boolean;
    data?: T;
    error?: AuthError;
}
export const signInUsingEmailAndPassword = async (
    email: string,
    password: string,
) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        return {
            success: true,
            data: user,
        };
    }
    catch (error: any){
        const errorMessage = getFirebaseErrorMessage(error.code);
        return {
            success: false,
            error: {
                code: error.code,
                message: errorMessage,
            } as AuthError,
        } as AuthResult<any>;
    }
}
export const signUpUsingEmailAndPassword = async (
    email: string,
    password: string,
    reEnterPassword: string,
) => {
    if (password !== reEnterPassword) {
        return {
            success: false,
            error: {
                code: "auth/reenter-password",
                message: "Mật khẩu không khớp",
            } as AuthError,
        } as AuthResult<any>;
    }
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name: '',
            email: user.email,
            profileUrl: '',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return {
            success: true,
            data: user,
        };
    }
    catch (error: any) {
        const errorMessage = getFirebaseErrorMessage(error.code);
        return {
            success: false,
            error: {
                code: error.code,
                message: errorMessage,
            },
        };
    }
}
export const signOut = async (): Promise<AuthResult<void>> => {
    try {
        await firebaseSignOut(auth);
        return { success: true };
    } catch (error: any) {
        return { 
            success: false, 
            error: { 
                code: error.code || "auth/sign-out-error", 
                message: getFirebaseErrorMessage(error)
            } 
        };
    }
};