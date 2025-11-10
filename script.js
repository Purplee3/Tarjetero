// Configurar Firebase
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
const storage = firebase.storage();
const db = firebase.firestore();

const googleLogin = document.getElementById("googleLogin");
const editor = document.getElementById("editor");
const login = document.getElementById("login");
const userName = document.getElementById("userName");

// 🔹 Iniciar sesión con Google
googleLogin.onclick = async () => {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);
    const user = result.user;

    login.style.display = "none";
    editor.style.display = "block";
    userName.textContent = user.displayName;
  } catch (error) {
    alert("❌ No se pudo iniciar sesión: " + error.message);
  }
};

// 🔹 Guardar tarjeta
document.getElementById("guardar").onclick = async () => {
  const user = auth.currentUser;
  if (!user) {
    alert("Debes iniciar sesión primero.");
    return;
  }

  const nombre = document.getElementById("nombre").value.trim();
  const link = document.getElementById("link").value.trim();
  const foto = document.getElementById("foto").files[0];

  if (!nombre || !foto || !link) {
    alert("Completa todos los campos antes de continuar.");
    return;
  }

  try {
    // Subir foto
    const ref = storage.ref(fotos/${user.uid}.jpg);
    await ref.put(foto);
    const fotoURL = await ref.getDownloadURL();

    // Guardar datos
    await db.collection("tarjetas").doc(user.uid).set({
      nombre,
      link,
      fotoURL
    });

    const url = ${window.location.origin}/tarjeta.html?id=${user.uid};
    const qrCanvas = document.createElement("canvas");
    QRCode.toCanvas(qrCanvas, url, { width: 150 });

    document.getElementById("resultado").innerHTML = `
      <p>✅ Tu tarjeta está lista:</p>
      <a href="${url}" target="_blank">${url}</a><br><br>
    `;
    document.getElementById("resultado").appendChild(qrCanvas);

  } catch (error) {
    alert("❌ Error al guardar: " + error.message);
    console.error(error);
  }
};
