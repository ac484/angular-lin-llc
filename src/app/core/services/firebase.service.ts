import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit } from '@angular/fire/firestore';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { Storage, ref, uploadBytes, getDownloadURL, deleteObject } from '@angular/fire/storage';
import { Observable, from } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

// 本檔案依據 Firebase Console 專案設定，使用 Firebase Client SDK 操作 Cloud Firestore

export interface User {
  id?: string;
  email: string;
  displayName?: string;
  role?: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private firestore: Firestore,
    private auth: Auth,
    private storage: Storage
  ) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // 認證相關方法
  async signIn(email: string, password: string): Promise<any> {
    if (!this.isBrowser()) throw new Error('signIn 僅能於瀏覽器呼叫');
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async signUp(email: string, password: string): Promise<any> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  async signOut(): Promise<void> {
    return signOut(this.auth);
  }

  getCurrentUser(): Observable<any> {
    return user(this.auth);
  }

  // Firestore 操作方法
  async getDocument<T>(collectionName: string, docId: string): Promise<T | null> {
    const docRef = doc(this.firestore, collectionName, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as T : null;
  }

  async getDocuments<T>(collectionName: string): Promise<T[]> {
    if (!this.isBrowser()) {
      return [];
    }
    const querySnapshot = await getDocs(collection(this.firestore, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
  }

  async addDocument<T extends Record<string, any>>(collectionName: string, data: T): Promise<string> {
    const docRef = await addDoc(collection(this.firestore, collectionName), data);
    return docRef.id;
  }

  async updateDocument<T>(collectionName: string, docId: string, data: Partial<T>): Promise<void> {
    const docRef = doc(this.firestore, collectionName, docId);
    await updateDoc(docRef, data as any);
  }

  async deleteDocument(collectionName: string, docId: string): Promise<void> {
    const docRef = doc(this.firestore, collectionName, docId);
    await deleteDoc(docRef);
  }

  // Storage 操作方法
  async uploadFile(file: File, path: string): Promise<string> {
    const storageRef = ref(this.storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  }

  async deleteFile(path: string): Promise<void> {
    const storageRef = ref(this.storage, path);
    await deleteObject(storageRef);
  }
} 