import { collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export interface Signature {
  id: string;
  userId: string;
  documentTitle: string;
  signatureId: string;
  signerName: string;
  organization: string;
  role: string;
  createdAt: string;
  verified: boolean;
  pdfData?: string;
}

export async function saveSignature(signature: Signature) {
  try {
    if (!signature.userId) throw new Error('User ID is required');
    const docRef = await addDoc(collection(db, 'signatures'), signature);
    return docRef.id;
  } catch (error) {
    console.error('Error saving signature:', error);
    throw error;
  }
}

export async function getSignatures() {
  try {
    const signaturesRef = collection(db, 'signatures');
    const snapshot = await getDocs(signaturesRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Signature[];
  } catch (error) {
    console.error('Error getting signatures:', error);
    return [];
  }
}

export async function getSignaturesByUserId(userId: string) {
  try {
    if (!userId) throw new Error('User ID is required');
    
    const q = query(collection(db, 'signatures'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }) as Signature)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error getting user signatures:', error);
    return [];
  }
}

export async function getSignatureById(signatureId: string) {
  try {
    const q = query(collection(db, 'signatures'), where('signatureId', '==', signatureId));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Signature;
  } catch (error) {
    console.error('Error getting signature by ID:', error);
    return null;
  }
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  organization?: string;
  role?: string;
  createdAt: string;
}

export async function updateUser(userId: string, userData: Partial<User>) {
  try {
    if (!userId) throw new Error('User ID is required');
    
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, userData);
    
    // Get updated user data
    const updatedDoc = await getDoc(userRef);
    return { id: updatedDoc.id, ...updatedDoc.data() } as User;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export async function getUsers() {
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as User[];
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
}

export async function deleteUser(userId: string) {
  try {
    if (!userId) throw new Error('User ID is required');
    
    await deleteDoc(doc(db, 'users', userId));
    
    // Delete user's signatures
    const userSignatures = await getSignaturesByUserId(userId);
    await Promise.all(
      userSignatures.map(sig => deleteDoc(doc(db, 'signatures', sig.id)))
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}