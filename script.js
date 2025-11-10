// 🔧 Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAMcJot3v9EBnUHHDKxmAOdamawSrUN1J0",
  authDomain: "tarjetero-8aa5e.firebaseapp.com",
  projectId: "tarjetero-8aa5e",
  storageBucket: "tarjetero-8aa5e.appspot.com",
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const storage = firebase.storage();
const db = firebase.firestore();

// Elementos del DOM
const googleLogin = document.getElementById("googleLogin");
const editor = document.getElementById("editor");
const login = document.getElementById("login");
const userName = document.getElementById("userName");

// LOGIN CON GOOGLE
googleLogin.onclick = async () => {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);
    const user = result.user;

    login.style.display = "none";
    editor.style.display = "block";
    userName.textContent = user.displayName;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    alert("No se pudo iniciar sesión con Google.");
  }
};

// GUARDAR TARJETA
document.getElementById("guardar").onclick = async () => {
  const user = auth.currentUser;
  const nombre = document.getElementById("nombre").value.trim();
  const link = document.getElementById("link").value.trim();
  const foto = document.getElementById("foto").files[0];

  if (!nombre || !foto || !link) {
    alert("Completa todos los campos.");
    return;
  }

  try {
    // Subir la foto a Firebase Storage
    const ref = storage.ref(`fotos/${user.uid}.jpg`);
    await ref.put(foto);
    const fotoURL = await ref.getDownloadURL();

    // Guardar datos en Firestore
    await db.collection("tarjetas").doc(user.uid).set({
      nombre,
      link,
      fotoURL
    });

    // Generar URL de la tarjeta
    const url = `${window.location.origin}/tarjeta.html?id=${user.uid}`;

    // Generar QR Code
    const qrCanvas = document.createElement("canvas");
    QRCode.toCanvas(qrCanvas, url, { width: 150 });

    // Mostrar resultado
    const resultado = document.getElementById("resultado");
    resultado.innerHTML = `
      <p>Tu tarjeta está lista:</p>
      <a href="${url}" target="_blank">${url}</a><br>
    `;
    resultado.appendChild(qrCanvas);

  } catch (error) {
    console.error("Error al guardar la tarjeta:", error);
    alert("Ocurrió un error al guardar tu tarjeta.");
  }
};
