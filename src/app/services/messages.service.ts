import { Injectable } from '@angular/core';
import { MessageModel } from '../models/MessageModel';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { firestore } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore
    ) { }

  sendMessage(uid: string, model: MessageModel) {
    var new_id = this.db.createId();
    model.$key = new_id;

    this.db.collection(`users`).doc(uid)
    .update({
      messages: firestore.FieldValue.arrayUnion(model)
    })
  }

  // Get List
  getMessages(uid: string) {
    return this.db.collection(`users`).doc(uid).snapshotChanges();
  }

}