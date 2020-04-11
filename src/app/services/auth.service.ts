import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userId: any;

  constructor(private db: AngularFirestore) { }

  doRegister(user) {
    return this.db.collection('user').add({
      email: user.email,
      password: user.password,
      authenticated: user.authenticated
    });
  }

  doLogin(user): Observable<any> {
    return this.db.collection('user', ref => ref.where('email', '==', user.email).where('password', '==', user.password)).get();
  }

  doLogOut(id) {
    return this.db.collection("user").doc(id).update({
      authenticated: false
  });
  }

  updateAuth(id, auth) {
    return this.db.collection("user").doc(id).update({
      authenticated: auth
  });
  }

  getUsers(): Observable<any> {
    return this.db.collection('user').get();
  }

  saveMessage(message) {
    console.log('auth ervice',message);
    return this.db.collection('messages').add(message);
  }

  getMessage() {
    return this.db.collection('messages', ref => ref.orderBy('date', 'asc')).snapshotChanges();
  }

  getRecentMessage() {
    return this.db.collection('messages', ref => ref.orderBy('date', 'asc')).stateChanges();
  }
}
