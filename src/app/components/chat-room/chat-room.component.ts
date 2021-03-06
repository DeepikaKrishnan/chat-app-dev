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
  sub1: any;
  constructor(private auth: AuthService, private route: Router, private activate: ActivatedRoute, private dp:DatePipe) {
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
       // this.getMessage();
       this.getRecentMessage();
      });

      //this.sub.push(rsub);
      this.sub.push(usub);
   });
  }

  getMessage() {
   this.sub1 = this.auth.getMessage().subscribe((r) => { 
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
      this.sub1.unsubscribe();
      
      this.getRecentMessage();
    });
  }

  getRecentMessage() {
   const rsub =  this.auth.getRecentMessage().subscribe((r) => {
      if(r && r.length) {
        const filteredData = r.filter((v: any) => {
          if (v.type == 'added') {
            let data1: any;
            data1 = v.payload.doc.data();
            return (data1.senderId == this.senderId || data1.receiverId == this.senderId) && (data1.receiverId == this.receiverId || data1.senderId == this.receiverId);
          }
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

        const receiverData = r.filter((v: any) => { 
          if (v.type == 'added') {
            let data1: any;
            data1 = v.payload.doc.data();
            return (data1.receiverId == this.senderId && data1.senderId == this.receiverId);
          }
        });

        receiverData.map((x)=> {
          this.auth.updateRead(x.payload.doc.id);
        })
        this.messages.push(...newData);
      }
      this.sub.push(rsub);
    })
  }

  sendNotification(text) {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }
  
    else if ((Notification as any).permission === "granted") {
      var notification = new Notification(text);
    }

    else if ((Notification as any).permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
          var notification = new Notification(text);
        }
      });
    }
  }
  

  sendMessage(event: any) {
    const files = !event.files ? [] : event.files.map((file) => {
      return {
        url: file.src || "",
        type: file.type,
        icon: 'file-text-outline',
      };
    });
    this.saveMessage(event, files);
  }

  saveMessage(event, files) {
    const message = {
      text: event.message,
      date: this.dp.transform(new Date(), 'yyyy-MM-dd hh:mm:ss'),
      type: files.length ? 'file' : 'text',
      files: files,
      senderId: this.senderId,
      receiverId: this.receiverId,
      read: false
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
