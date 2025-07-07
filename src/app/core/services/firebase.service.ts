import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, setDoc } from '@angular/fire/firestore';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, user, User as FirebaseUser } from '@angular/fire/auth';
import { Storage, ref, uploadBytes, getDownloadURL, deleteObject } from '@angular/fire/storage';
import { Observable, from } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../../workspace/components/dock/models/workspace.types';

// 本檔案依據 Firebase Console 專案設定，使用 Firebase Client SDK 操作 Cloud Firestore

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
    try {
      return await signInWithEmailAndPassword(this.auth, email, password);
    } catch (e) {
      return null;
    }
  }

  async signUp(email: string, password: string): Promise<any> {
    try {
      return await createUserWithEmailAndPassword(this.auth, email, password);
    } catch (e) {
      return null;
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (e) {}
  }

  getCurrentUser(): Observable<any> {
    return user(this.auth);
  }

  // Firestore 操作方法
  async getDocument<T>(collectionName: string, docId: string): Promise<T | null> {
    try {
      const docRef = doc(this.firestore, collectionName, docId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as T : null;
    } catch (e) {
      return null;
    }
  }

  async getDocuments<T>(collectionName: string): Promise<T[]> {
    if (!this.isBrowser()) {
      return [];
    }
    try {
      const querySnapshot = await getDocs(collection(this.firestore, collectionName));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
    } catch (e) {
      return [];
    }
  }

  async addDocument<T extends Record<string, any>>(collectionName: string, data: T): Promise<string | null> {
    try {
      const docRef = await addDoc(collection(this.firestore, collectionName), data);
      return docRef.id;
    } catch (e) {
      return null;
    }
  }

  async updateDocument<T>(collectionName: string, docId: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = doc(this.firestore, collectionName, docId);
      await updateDoc(docRef, data as any);
    } catch (e) {}
  }

  async deleteDocument(collectionName: string, docId: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, collectionName, docId);
      await deleteDoc(docRef);
    } catch (e) {}
  }

  // Storage 操作方法
  async uploadFile(file: File, path: string): Promise<string | null> {
    try {
      const storageRef = ref(this.storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    } catch (e) {
      return null;
    }
  }

  async deleteFile(path: string): Promise<void> {
    try {
      const storageRef = ref(this.storage, path);
      await deleteObject(storageRef);
    } catch (e) {}
  }

  // 新增：用戶登入後寫入 Firestore
  async createUserInFirestore(firebaseUser: FirebaseUser, defaultRole: string = 'guest'): Promise<void> {
    const userDocRef = doc(this.firestore, 'users', firebaseUser.uid);
    const newUser: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email ?? '',
      displayName: firebaseUser.displayName || '',
      role: defaultRole,
      createdAt: new Date()
    };
    await setDoc(userDocRef, newUser, { merge: true });
  }
} 