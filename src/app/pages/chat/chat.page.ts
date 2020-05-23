import { Component, OnInit } from '@angular/core';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  textInput:string;

  constructor(
    private messageService: MessagesService
  ) { }

  ngOnInit() {
    this.messageService.getMessages();
  }

  sendMessage(){
    this.messageService.sendMessage({
      message: this.textInput,
      datetime: new Date().toISOString()
    });

    this.textInput = "";
  }

}
