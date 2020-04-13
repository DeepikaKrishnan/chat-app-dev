import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit, OnDestroy {
  users: any;
  userId: any;
  data: any;
  sub: any = [];
  constructor(private auth: AuthService, private route: Router) {
    console.log('contact contructor');
    this.userId = localStorage.getItem('userId');
    this.data = {
      list: [],
    }
   }

  ngOnInit() {

    const usub = this.auth.getUsers().subscribe((r) => {
      if(r.docs && r.docs.length) {
        const filteredData = r.docs.filter((h) => h.id != this.userId)
        this.users = filteredData.map((x) => {
          const data = {
            id: x.id,
            email: x.data().email,
            name: x.data().email.split('@')[0],
            avatar: x.data().email.charAt(0)
          }
          return data;
        });
      } else {
        
      }
      this.processMsg();
    });
    this.sub.push(usub);
  }

  navigateToChat(user) {
    this.route.navigateByUrl('/chat/'+user.id);
  }

  processMsg() {
    this.users.map((user) => {
      user.msg = [];
      user.unread = [];
      const rsub =  this.auth.getRecentMessage().subscribe((mg) => {
        const userId = user.id;
          if (mg && mg.length) {
            mg.map((mg) => {
              let data1: any = {};
              data1 = mg.payload.doc.data();
              if ((data1.senderId == this.userId || data1.receiverId == this.userId) && (data1.receiverId == userId || data1.senderId == userId)) {
                user.msg.push(data1);
                if (!data1.read && data1.senderId == userId) {
                  user.unread.push(data1);
                }
              }
            })
          }
          user.unreadCnt = user.unread && user.unread.length;
          if (user.msg && user.msg.length>0) {
            user.lastMsg =   user.msg[user.msg.length-1].type === 'file' ? 'Image' : user.msg[user.msg.length-1].text;
          }
      });
      this.data.list.push(user);
      this.sub.push(rsub);
    });
  }

  ngOnDestroy() {
    this.sub.map((x) => {
      x.unsubscribe();
    })
  }

}
