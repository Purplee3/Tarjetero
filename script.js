// ✅ Configura tu Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAMcJot3v9EBnUHHDKxmAOdamawSrUN1J0",
  authDomain: "tarjetero-8aa5e.firebaseapp.com",
  projectId: "tarjetero-8aa5e",
  storageBucket: "tarjetero-8aa5e.appspot.com",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Referencias a los elementos del DOM
const googleLogin = document.getElementById("googleLogin");
const editor = document.getElementById("editor");
const login = document.getElementById("login");
const userName = document.getElementById("userName");
const guardarBtn = document.getElementById("guardar");

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
    console.error("❌ Error al iniciar sesión:", error);
    alert("Error al iniciar sesión: " + error.message);
  }
};

// 🔹 Guardar tarjeta
guardarBtn.onclick = async () => {
  const user = auth.currentUser;
  const nombre = document.getElementById("nombre").value.trim();
  const link = document.getElementById("link").value.trim();
  const foto = document.getElementById("foto").files[0];

  if (!user) {
    alert("Primero inicia sesión con Google.");
    return;
  }

  if (!nombre || !link || !foto) {
    alert("Completa todos los campos antes de guardar.");
    return;
  }

  try {
    // Subir la foto
    const ref = storage.ref(`fotos/${user.uid}.jpg`);
    await ref.put(foto);
    const fotoURL = await ref.getDownloadURL();

    // Guardar datos en Firestore
    await db.collection("tarjetas").doc(user.uid).set({
      nombre,
      link,
      fotoURL,
      userId: user.uid,
      timestamp: new Date(),
    });

    // Generar link y QR
    const url = `${window.location.origin}/tarjeta.html?id=${user.uid}`;
    const qrCanvas = document.createElement("canvas");
    QRCode.toCanvas(qrCanvas, url, { width: 150 });

    document.getElementById("resultado").innerHTML = `
      <p>✅ Tu tarjeta está lista:</p>
      <a href="${url}" target="_blank">${url}</a><br><br>
    `;
    document.getElementById("resultado").appendChild(qrCanvas);

    console.log("✅ Tarjeta guardada correctamente");
  } catch (error) {
    console.error("❌ Error al guardar tarjeta:", error);
    alert("Error al guardar la tarjeta: " + error.message);
  }
};
