const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

const serviceAccount = require(path.join(__dirname, "serviceAccountKey.json"));

// IMPORTANT: bucket должен совпадать со storageBucket из firebaseConfig нового проекта
const BUCKET = "bakhur-e08f1.firebasestorage.app"; // например: bakhur-e08f1.firebasestorage.app

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: BUCKET,
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

function encodePath(p) {
  return encodeURIComponent(p).replace(/%2F/g, "%2F");
}

async function uploadOne(localFilePath) {
  const fileName = path.basename(localFilePath);       // p-001.jpg
  const id = path.parse(fileName).name;                // p-001
  const dest = `perfumes/${fileName}`;                 // perfumes/p-001.jpg

  // Токен для download URL (чтобы ссылка работала без лишней логики)
  const token = (globalThis.crypto?.randomUUID?.() || require("crypto").randomUUID());

  await bucket.upload(localFilePath, {
    destination: dest,
    metadata: {
      metadata: {
        firebaseStorageDownloadTokens: token,
      },
      contentType: "image/jpeg",
      cacheControl: "public, max-age=31536000",
    },
  });

  const url =
    `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/` +
    `${encodeURIComponent(dest)}?alt=media&token=${token}`;

  // Пишем URL прямо в документ товара
  await db.collection("perfumes").doc(id).set(
    { image: url, imagePath: dest },
    { merge: true }
  );

  console.log("✅", id, "->", url);
}

async function main() {
  const dir = path.join(__dirname, "images");
  const files = fs.readdirSync(dir)
    .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
    .map((f) => path.join(dir, f));

  for (const f of files) {
    await uploadOne(f);
  }

  console.log("🎉 Done. Uploaded:", files.length);
}

main().catch((e) => {
  console.error("❌", e);
  process.exit(1);
});
