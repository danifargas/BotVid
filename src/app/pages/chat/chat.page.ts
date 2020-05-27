import { Component, OnInit, ViewChild } from '@angular/core';
import { MessagesService } from 'src/app/services/messages.service';
import { AuthService } from 'src/app/services/auth.service';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { File } from '@ionic-native/file/ngx';
import * as moment from 'moment';
import { MessageModel } from 'src/app/models/MessageModel';

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
  ) {
  }

  ngOnInit() {
    this.auth.user.subscribe(u => {
      if (u) {
        this.userUID = u.uid;
        this.messageService.getMessages(u.uid).subscribe((res) => {
          let data: any = res.payload.data()
          this.messages = data.messages;
          console.log(this.messages);
        });
      }
    });

  }


  sendMessage() {
    var model: MessageModel =  {
      message: this.textInput,
      datetime: new Date().toISOString(),
      isBot: false,
      isNew: true
    };

    this.messageService.sendMessage(this.userUID, model);
    this.textInput = "";

    this.messages.push(model)
    this.pushBotLoading();
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

    this.recordingFileName = moment().format('YYYYMMDD_HHmm_ss') + '.3gp';
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
      let recordedAudio = base64File;
      this.pushBotLoading();
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

  pushBotLoading(){
    this.messages.push({
      message: "",
      datetime: new Date().toISOString(),
      isLoading: true,
      isBot: true,
    });
  }

}
