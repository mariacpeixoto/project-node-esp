const express = require("express");
const bodyParser = require("body-parser");

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

// Firebase Admin SDK
const serviceAccount = require("./project-node-esp-firebase-adminsdk-ei2v7-a168407d8e.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const app = express();
app.use(bodyParser.json());

// Rota para receber os logs de movimento
app.post("/movimento", async (req, res) => {
  const { movimento } = req.body;

  if (!movimento) {
    return res.status(400).send("Movimento é obrigatório");
  }

  try {
    const docRef = await db.collection("movimentos").add({
      movimento,
      timestamp: FieldValue.serverTimestamp(),
    });
    res.status(200).send(`Movimento registrado com ID: ${docRef.id}`);
  } catch (error) {
    console.error("Erro ao registrar movimento: ", error);
    res.status(500).send("Erro ao registrar movimento");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
