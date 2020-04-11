import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute  } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit, OnDestroy  {
  messages: any = [];
  sub: any = [];
  senderId: any;
  senderData: any;
  receiverId: any;
  receiverData: any;
  rec: any;
  constructor(private auth: AuthService, private route: Router, private activate: ActivatedRoute, private dp:DatePipe) {
    var myNotification = new Notification('hai');
   }

  ngOnInit(): void {
    this.senderId = localStorage.getItem('userId');
    const rsub = this.activate.params.subscribe(params => {
      this.receiverId = params['id'];
      const usub = this.auth.getUsers().subscribe((r) => {
        if(r.docs && r.docs.length) {
          const receiverData = r.docs.find((x) => x.id == this.receiverId);
          if (receiverData) {
            this.receiverData = receiverData.data();
            this.receiverData.name = this.receiverData.email.split('@')[0];
          }
          const senderData = r.docs.find((x) => x.id == this.senderId);
          if (senderData) {
            this.senderData = senderData.data();
            this.senderData.name = this.senderData.email.split('@')[0];
          }
        }
        this.getMessage();
      });

      //this.sub.push(rsub);
      this.sub.push(usub);
   });
  }

  getMessage() {
    const sub1 = this.auth.getMessage().subscribe((r) => { 
      if(r && r.length) {
        const filteredData = r.filter((v) => {
          let data1: any;
          data1 = v.payload.doc.data();
          return (data1.senderId == this.senderId || data1.receiverId == this.senderId) && (data1.receiverId == this.receiverId || data1.senderId == this.receiverId);
        });
        this.messages = filteredData.map((x) => {
          let data: any = {};
          data = x.payload.doc.data();
          data.reply = (data.senderId == this.senderId)? true : false;
          data.user = {
            name : (data.reply)?this.senderData.name : this.receiverData.name
          };
          return data;
        })
      }
      sub1.unsubscribe();
      this.getRecentMessage();
    });
  }

  getRecentMessage() {
   const rsub =  this.auth.getRecentMessage().subscribe((r) => {
      if(r && r.length) {
        const filteredData = r.filter((v: any) => {
          let data1: any;
          data1 = v.payload.doc.data();
          return (data1.senderId == this.senderId || data1.receiverId == this.senderId) && (data1.receiverId == this.receiverId || data1.senderId == this.receiverId);
        });
        const newData = filteredData.map((x: any) => {
          let data: any = {};
          data = x.payload.doc.data();
          data.reply = (data.senderId == this.senderId)? true : false;
          data.user = {
            name : (data.reply)?this.senderData.name : this.receiverData.name
          };
          return data;
        });
        this.messages.push(...newData);
      }
      this.sub.push(rsub);
    })
  }
  

  sendMessage(event: any) {
    const files = !event.files ? [] : event.files.map((file) => {
      return {
        url: file.src || "",
        type: file.type,
        icon: 'file-text-outline',
      };
    });

    /*this.messages.push({
      text: event.message,
      date: this.dp.transform(new Date(), 'yyyy-MM-dd hh:mm:ss'),
      reply: true,
      type: files.length ? 'file' : 'text',
      files: files,
      user: {
        name: this.senderData.email.split('@')[0]
      },
      senderId: this.senderId,
      receiverId: this.receiverId
    });*/

    this.saveMessage(event, files);

    console.log(this.messages);
    /*const botReply = this.chatShowcaseService.reply(event.message);
    if (botReply) {
      setTimeout(() => { this.messages.push(botReply) }, 500);
    }*/
  }

  saveMessage(event, files) {
    const message = {
      text: event.message,
      date: this.dp.transform(new Date(), 'yyyy-MM-dd hh:mm:ss'),
      //reply: true,
      type: files.length ? 'file' : 'text',
      files: files,
      senderId: this.senderId,
      receiverId: this.receiverId
    };
    this.auth.saveMessage(message).then((x) => {
      
    });
  }

  logout() {
    const userId = localStorage.getItem('userId');
    this.auth.doLogOut(userId).then(()  => {
      localStorage.removeItem('userId');
      this.route.navigateByUrl('[/login]');
    });
  }

  ngOnDestroy() {
    this.sub.map((x: any) => {
      x.unsubscribe();
    });
  }

}
