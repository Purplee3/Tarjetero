A// ✅ Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAMcJot3v9EBnUHHDKxmAOdamawSrUN1J0",
  authDomain: "tarjetero-8aa5e.firebaseapp.com",
  projectId: "tarjetero-8aa5e",
  storageBucket: "tarjetero-8aa5e.appspot.com",
  messagingSenderId: "1031258110983",
  appId: "1:1031258110983:web:8819d24f7b113378f17ea2"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

const googleLogin = document.getElementById("googleLogin");
const editor = document.getElementById("editor");
const login = document.getElementById("login");
const userName = document.getElementById("userName");

// 🔹 Iniciar sesión con Google
googleLogin.onclick = async () => {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    const result = await auth.signInWithPopup(provider);
    const user = result.user;

    if (!user) throw new Error("No se obtuvo información del usuario.");

    login.style.display = "none";
    editor.style.display = "block";
    userName.textContent = user.displayName;
  } catch (err) {
    console.error("Error de autenticación:", err);
    alert("❌ Error al iniciar sesión con Google:\n" + err.message);
  }
};
