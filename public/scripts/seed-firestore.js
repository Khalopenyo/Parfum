const admin = require("firebase-admin");
const path = require("path");

const serviceAccount = require(path.join(__dirname, "serviceAccountKey.json"));
const perfumes = require(path.join(__dirname, "perfumes.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function seedPerfumes() {
  const col = db.collection("perfumes");

  // Firestore batch лимит: 500 операций за раз
  const chunks = [];
  for (let i = 0; i < perfumes.length; i += 450) chunks.push(perfumes.slice(i, i + 450));

  let total = 0;
  for (const chunk of chunks) {
    const batch = db.batch();
    for (const p of chunk) {
      const id = p.id || col.doc().id; // если id нет — создастся автоматически
      batch.set(col.doc(id), p, { merge: true });
    }
    await batch.commit();
    total += chunk.length;
    console.log(`Uploaded: ${total}/${perfumes.length}`);
  }

  console.log("✅ Done. Total perfumes:", perfumes.length);
}

seedPerfumes().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});
