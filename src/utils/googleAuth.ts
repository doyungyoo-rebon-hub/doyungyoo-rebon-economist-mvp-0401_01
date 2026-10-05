import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App safely (singleton)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Configure Google Auth Provider with requested Google Workspace scopes
export const googleDocsProvider = new GoogleAuthProvider();
export const SCOPES = [
  'https://www.googleapis.com/auth/documents',
  'https://www.googleapis.com/auth/drive.file'
];

SCOPES.forEach((scope) => {
  googleDocsProvider.addScope(scope);
});
googleDocsProvider.setCustomParameters({
  prompt: 'consent'
});

// Flag to indicate if we are in the middle of a sign-in flow
let isSigningIn = false;

// Cache the access token strictly in memory (NEVER in localStorage/sessionStorage)
let cachedAccessToken: string | null = null;
let cachedUser: User | null = null;

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

// Initialize auth state listener
export const initAuth = (
  onAuthChange?: (state: AuthState) => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    cachedUser = user;
    if (user) {
      if (cachedAccessToken) {
        onAuthChange?.({
          user,
          accessToken: cachedAccessToken,
          isAuthenticated: true
        });
      } else if (!isSigningIn) {
        // User exists in Firebase session but token needs refresh
        onAuthChange?.({
          user,
          accessToken: null,
          isAuthenticated: false
        });
      }
    } else {
      cachedAccessToken = null;
      onAuthChange?.({
        user: null,
        accessToken: null,
        isAuthenticated: false
      });
    }
  });
};

// Sign in with Google (Popup)
export const googleSignIn = async (): Promise<{ user: User; accessToken: string }> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, googleDocsProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Google Workspace 인증 토큰을 수신하지 못했습니다.');
    }

    cachedAccessToken = credential.accessToken;
    cachedUser = result.user;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('[Google Auth Error]', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

// Retrieve in-memory token
export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

// Retrieve current cached user
export const getCurrentUser = (): User | null => {
  return cachedUser;
};

// Sign out
export const googleSignOut = async (): Promise<void> => {
  await signOut(auth);
  cachedAccessToken = null;
  cachedUser = null;
};
