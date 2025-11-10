// Configura Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAMcJot3v9EBnUHHDKxmAOdamawSrUN1J0",
  authDomain: "tarjetero-8aa5e.firebaseapp.com",
  projectId: "tarjetero-8aa5e",
  storageBucket: "tarjetero-8aa5e.appspot.com",
};
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const storage = firebase.storage();
const db = firebase.firestore();

console.log("✅ Firebase inicializado correctamente");

const googleLogin = document.getElementById("googleLogin");
const editor = document.getElementById("editor");
const login = document.getElementById("login");
const userName = document.getElementById("userName");

// Iniciar sesión con Google
googleLogin.onclick = async () => {
  try {
    console.log("🟢 Intentando iniciar sesión con Google...");
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);
    const user = result.user;
    console.log("✅ Sesión iniciada:", user.displayName);

    login.style.display = "none";
    editor.style.display = "block";
    userName.textContent = user.displayName;
  } catch (error) {
    console.error("❌ Error al iniciar sesión:", error);
    alert("No se pudo iniciar sesión.");
  }
};

// Guardar tarjeta
document.getElementById("guardar").onclick = async () => {
  console.log("🟢 Botón GUARDAR presionado");

  const user = auth.currentUser;
  if (!user) {
    alert("Debes iniciar sesión primero.");
    console.log("⚠️ No hay usuario autenticado");
    return;
  }

  const nombre = document.getElementById("nombre").value.trim();
  const link = document.getElementById("link").value.trim();
  const foto = document.getElementById("foto").files[0];

  if (!nombre || !foto || !link) {
    alert("Completa todos los campos antes de continuar.");
    console.log("⚠️ Campos vacíos");
    return;
  }

  try {
    console.log("📤 Subiendo foto...");
    const ref = storage.ref(`fotos/${user.uid}.jpg`);
    await ref.put(foto);
    console.log("✅ Foto subida correctamente");

    const fotoURL = await ref.getDownloadURL();
    console.log("🌐 URL de la foto:", fotoURL);

    console.log("📝 Guardando datos en Firestore...");
    await db.collection("tarjetas").doc(user.uid).set({
      nombre,
      link,
      fotoURL
    });
    console.log("✅ Datos guardados correctamente en Firestore");

    const url = `${window.location.origin}/tarjeta.html?id=${user.uid}`;
    console.log("🌍 URL de la tarjeta:", url);

    // Mostrar resultado
    const qrCanvas = document.createElement("canvas");
    QRCode.toCanvas(qrCanvas, url, { width: 150 });
    document.getElementById("resultado").innerHTML = `
      <p>✅ Tu tarjeta está lista:</p>
      <a href="${url}" target="_blank">${url}</a><br><br>
    `;
    document.getElementById("resultado").appendChild(qrCanvas);

  } catch (error) {
    console.error("❌ Error al guardar la tarjeta:", error);
    alert("Ocurrió un error al guardar la tarjeta. Mira la consola para más detalles.");
  }
};
