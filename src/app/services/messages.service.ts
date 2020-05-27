import { Injectable } from '@angular/core';
import { MessageModel } from '../models/MessageModel';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { firestore } from 'firebase';
import { HttpClient } from  '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private http: HttpClient
    ) { }

    /*
  sendMessageToDB(uid: string, model: MessageModel) {
    var new_id = this.db.createId();
    model.$key = new_id;

    this.db.collection(`users`).doc(uid)
    .update({
      messages: firestore.FieldValue.arrayUnion(model)
    })
  }
*/
  sendMessage(uid: string, model: MessageModel) {
    const data = new FormData();
    data.append("queryInput", model.message);
    data.append("sessionId", uid);
    this.http.post('https://us-central1-botvid-48dc1.cloudfunctions.net/dialogflowGateway', data).subscribe((res) => {
      console.log(res);
    });

  }
  // Get List
  getMessages(uid: string) {
    return this.db.collection(`users`).doc(uid).snapshotChanges();
  }

}