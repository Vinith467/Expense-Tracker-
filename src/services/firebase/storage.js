import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import app from './config';

export const storage = getStorage(app);

/**
 * Upload a receipt/attachment file for a given user and return its download URL.
 * Path convention: receipts/{uid}/{expenseId}/{filename}
 */
export async function uploadReceipt(uid, expenseId, file) {
  const path = `receipts/${uid}/${expenseId}/${file.name}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function deleteReceipt(path) {
  const storageRef = ref(storage, path);
  return deleteObject(storageRef);
}
