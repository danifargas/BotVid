import { Injectable } from '@angular/core';
import { MessageModel } from '../models/MessageModel';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  messagesListRef: AngularFireList<any>;
  
  constructor(private db: AngularFireDatabase) { }
  

  sendMessage(model: MessageModel) {
    return this.messagesListRef.push({
      message: model.message,
    })
  }

  // Get List
  getMessages() {
    this.messagesListRef = this.db.list('/messages');
    console.log(this.messagesListRef)
    return this.messagesListRef;
  }

}