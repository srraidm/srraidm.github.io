import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAqEp3_pFLDZDYdH13y06VdVuOciOxM2Go",
    authDomain: "srraid-anime.firebaseapp.com",
    projectId: "srraid-anime",
    storageBucket: "srraid-anime.firebasestorage.app",
    messagingSenderId: "1068057087160",
    appId: "1:1068057087160:web:def40944cdbee892b7f84d",
    measurementId: "G-ENR5LKF37N"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const login = () => signInWithPopup(auth, provider);
export const logout = () => signOut(auth);

onAuthStateChanged(auth, (user) => {
    const btnLogin = document.getElementById('btn-login');
    const userProfile = document.getElementById('user-profile');
    const userPhoto = document.getElementById('user-photo');

    if (user) {
        if(btnLogin) btnLogin.classList.add('hidden');
        if(userProfile) {
            userProfile.classList.remove('hidden');
            userProfile.classList.add('flex');
        }
        if(userPhoto) userPhoto.src = user.photoURL;
        localStorage.setItem('srRaidUser', JSON.stringify({name: user.displayName, uid: user.uid}));
    } else {
        if(btnLogin) btnLogin.classList.remove('hidden');
        if(userProfile) userProfile.classList.add('hidden');
        localStorage.removeItem('srRaidUser');
    }
});

// Eventos globales
document.getElementById('btn-login')?.addEventListener('click', login);
document.getElementById('btn-logout')?.addEventListener('click', logout);