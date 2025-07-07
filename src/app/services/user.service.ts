import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private afs: AngularFirestore) {}

  upsertUser(user: User) {
    return this.afs.collection('users').doc(user.uid).set(user, { merge: true });
  }
}
