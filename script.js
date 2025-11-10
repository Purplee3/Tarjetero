// ✅ Configuración de Firebase
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
    const result = await auth.signInWithPopup(provider);
    const user = result.user;

    login.style.display = "none";
    editor.style.display = "block";
    userName.textContent = user.displayName;
  } catch (err) {
    alert("Error al iniciar sesión: " + err.message);
  }
};

// 🔹 Guardar tarjeta
document.getElementById("guardar").onclick = async () => {
  const user = auth.currentUser;
  const nombre = document.getElementById("nombre").value.trim();
  const profesion = document.getElementById("profesion").value.trim();
  const empresa = document.getElementById("empresa").value.trim();
  const youtube = document.getElementById("youtube").value.trim();
  const tiktok = document.getElementById("tiktok").value.trim();
  const foto = document.getElementById("foto").files[0];

  if (!user) return alert("Primero inicia sesión con Google.");
  if (!nombre || !profesion || !empresa || !foto) {
    alert("Completa todos los campos obligatorios.");
    return;
  }

  try {
    // Subir foto
    const ref = storage.ref(fotos/${user.uid}.jpg);
    await ref.put(foto);
    const fotoURL = await ref.getDownloadURL();

    // Guardar datos
    await db.collection("tarjetas").doc(user.uid).set({
      nombre, profesion, empresa, youtube, tiktok, fotoURL
    });

    // Generar link y QR
    const url = ${window.location.origin}/tarjeta.html?id=${user.uid};
    const qrCanvas = document.createElement("canvas");
    QRCode.toCanvas(qrCanvas, url, { width: 150 });

    document.getElementById("resultado").innerHTML = `
      <p>✅ Tu tarjeta está lista:</p>
      <a href="${url}" target="_blank">${url}</a><br><br>
    `;
    document.getElementById("resultado").appendChild(qrCanvas);
  } catch (err) {
    alert("Error al guardar tarjeta: " + err.message);
  }
