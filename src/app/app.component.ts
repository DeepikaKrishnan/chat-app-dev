import { Component, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'angular-chat';
  sub: any = [];
  senderId: any;
  constructor(private router: Router, private auth: AuthService, private active: ActivatedRoute) {
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

       const rsub =  this.auth.getRecentMessage().subscribe((r) => {
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
              if (this.router.url !== 'login') {
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
