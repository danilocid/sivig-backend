const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");

const app = express();
var serviceAccount = require("./credentials.json"); //Replace with your service account key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
app.post("/api/products", async (req, res) => {
  try {
    await db.collection("products").doc(req.body.id).create({
      name: req.body.name,
    });
    return res.status(200).json({ status: "success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", error: error });
  }
});
app.get("/api/products/:id_product", async (req, res) => {
  (async () => {
    try {
      const doc = db.collection("products").doc(req.params.id_product);
      const product = await doc.get();
      if (!product.exists) {
        return res
          .status(404)
          .json({ status: "error", error: "Product not found" });
      } else {
        const data = product.data();

        return res.status(200).json({ status: "success", data: data });
      }
      return res.status(200).json(data);
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ status: "error", error: error.message });
    }
  })();
});

app.get("/api/products", async (req, res) => {
  try {
    const query = db.collection("productss");
    const products = await query.get();
    const data = products.docs;
    const response = data.map((product) => ({
      id: product.id,
      name: product.data().name,
    }));
    if (!products.empty) {
      return res.status(200).json({ status: "success", data: response });
    } else {
      return res
        .status(404)
        .json({ status: "error", error: "Products not found" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ status: "error", error: error.message });
  }
});

exports.app = functions.https.onRequest(app);
