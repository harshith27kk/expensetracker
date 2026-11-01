// ─── Firestore CRUD helpers for transactions ─────────────────────────────────
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';

const COL = 'transactions';

/** Subscribe to all transactions, ordered by date descending.
 *  Returns an unsubscribe function. */
export function subscribeToTransactions(callback) {
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(data);
  });
}

/** Add a new transaction document. */
export async function addTransactionFS(transaction) {
  return addDoc(collection(db, COL), {
    ...transaction,
    createdAt: serverTimestamp(),
  });
}

/** Update an existing transaction by id. */
export async function updateTransactionFS({ id, ...rest }) {
  const ref = doc(db, COL, id);
  return updateDoc(ref, rest);
}

/** Delete a transaction by id. */
export async function deleteTransactionFS(id) {
  return deleteDoc(doc(db, COL, id));
}
