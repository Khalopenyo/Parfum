import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export async function fetchPerfumes() {
  const snap = await getDocs(collection(db, "perfumes"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
