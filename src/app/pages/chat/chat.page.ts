import { Component, OnInit, ViewChild } from '@angular/core';
import { MessagesService } from 'src/app/services/messages.service';
import { AuthService } from 'src/app/services/auth.service';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { File } from '@ionic-native/file/ngx';
import * as moment from 'moment';
import { MessageModel } from 'src/app/models/MessageModel';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  userUID: string;

  textInput: any;
  public messages: Array<MessageModel>;

  recording: boolean;
  recordingFileName: string;
  audioFile: MediaObject;

  timer: any;
  counter: string;

  constructor(
    private messageService: MessagesService,
    private auth: AuthService,
    private mediaCapture: MediaCapture,
    private media: Media,
    private file: File,
    private router: Router,
    private nav: NavController
  ) {
  }

  ngOnInit() {
    this.auth.user.subscribe(u => {
      if (u) {
        this.userUID = u.uid;
        this.messageService.getMessages(u.uid).then((querySnapshot) => {
          let messagesTMP = [];
          querySnapshot.forEach((doc: any) => {
              messagesTMP.push(doc.data());
          });
          this.messages = messagesTMP.sort(x=>x.datetime);
        });
      }
    });

  }


  sendMessage() {
    var userMsg: MessageModel =  {
      message: this.textInput,
      datetime: new Date().toISOString(),
      isBot: false,
      isNew: true
    };
    this.messages.push(userMsg);

    var bot = {
      message: "",
      datetime: new Date().toISOString(),
      isLoading: true,
      isBot: true,
      isNew: true
    };
    this.messages.push(bot);

    this.messageService.sendMessage(this.userUID, userMsg).subscribe((res: any) =>{ 
      bot.message = res.fulfillmentMessages[0].text.text[0];
      bot.isLoading = false;

      res.fulfillmentMessages.forEach((element, index) => {
        if(!index) return;
        this.messages.push({
          message: element.text.text[0],
          datetime: new Date().toISOString(),
          isLoading: false,
          isBot: true,
        });
      });
    });
    
    
    this.textInput = "";
  }
  /*
    recordAudio(){
      this.mediaCapture.captureAudio().then((res) =>{
        console.log(res);
      })
    }
  */

  recordAudio() {

    if (this.recording) {
      this.stopRecording();
      return;
    }

    this.recordingFileName = moment().format('YYYYMMDD_HHmm_ss') + '.aac';
    console.log(this.file.dataDirectory + this.recordingFileName);

    this.audioFile = this.media.create(this.file.dataDirectory + this.recordingFileName);
    this.audioFile.startRecord();
    this.recording = true;

    this.startTimer();

    this.audioFile.onError.subscribe(error => console.log('Error!', error));
    this.audioFile.onStatusUpdate.subscribe(status => console.log(status)); // fires when file status changes

  }

  stopRecording() {
    this.audioFile.stopRecord();
    this.recording = false;

    clearInterval(this.timer);

    this.file.readAsDataURL(this.file.dataDirectory, this.recordingFileName).then((base64File) => {
      console.log(base64File);
      let recordedAudio = base64File.split(',')[1];
      this.messageService.sendAudio(this.userUID, recordedAudio).subscribe((res: any) => {

      });
    }).catch((error) => { console.log("file error", error) })
  }

  startTimer() {
    let s = 0;
    this.counter = "00:00";
    this.timer = setInterval(x => {
      s++;

      this.counter = moment().startOf('day').seconds(s).format('mm:ss');
    }, 1000);

  }

  logout() {
    this.auth.logout()
      .then(value => {
        this.nav.navigateBack('login');
      })
      .catch(err => {
        console.error('Something went wrong:',err.message);
      });
  }

}
