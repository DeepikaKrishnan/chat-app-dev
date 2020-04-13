import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'angular-chat';
  sub: any = [];
  senderId: any;
  constructor(private router: Router, private auth: AuthService, private active: ActivatedRoute) {
    console.log('app contructor');
    this.senderId = localStorage.getItem('userId');

  
    const r1sub = this.router.events.subscribe((route) => {
      const id = localStorage.getItem('userId');
      if(route['url'] === '/login' && id) {
        this.router.navigateByUrl('/contacts');
      } else if (route['url'] !== '/login' && !id) {
        this.router.navigateByUrl('/login');
      }
    });

    this.sub.push(r1sub);
  }

  ngOnInit() {
    const rsub =  this.auth.getRecentMessage().subscribe((r) => {
      //this.getLastMsg(r)
      if(r && r.length) {
        const receiverData = r.filter((v: any) => { 
          if (v.type == 'added') {
            let data1: any;
            data1 = v.payload.doc.data();
            return (data1.receiverId == this.senderId);
          }
        });

        receiverData.map((x)=> {
          let data1: any;
            data1 = x.payload.doc.data();
            if (this.router.url !== 'login' && this.router.url !== '/chat/'+data1.senderId) {
              if (data1.senderId != this.senderId && !data1.read) {
                if (data1.type == 'text') {
                  this.sendNotification(data1.text);
                } else {
                  this.sendNotification('New file/image received');
                }
              }
            }
        })
      }
     })
     this.sub.push(rsub);
  }

  getLastMsg(mg) {
    let data: any = {
      msg: [],
      unread: []
    };
    this.auth.getUsers().subscribe((r) => {
      if(r.docs && r.docs.length) {
        const filteredData = r.docs.filter((h) => h.id != this.senderId);
        filteredData.map((user) => {
          const userId = user.id;
          if (mg && mg.length) {
            mg.map((mg) => {
              let data1: any = {};
              data1 = mg.payload.doc.data();
              if (data1.senderId == userId ) {
                data.msg.push(data1);
                if (!data1.read) {
                  data.unread.push(data1);
                }
              }
              return data;
            })
          }
          console.log('user', user.data().email)
          console.log('data', data);
        })

        this.auth.lastMsgData.msg = data.msg[data.msg.length-1].type=='text' ? data.msg[data.msg.length-1].text :  'Image';
        this.auth.lastMsgData.unreadCnt = data.unread.length;
        console.log(this.auth.lastMsgData);
      }

    });
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


  ngOnDestroy() {
    this.sub.map((x) => {
      x.unsubscribe();
    })
  }
}
