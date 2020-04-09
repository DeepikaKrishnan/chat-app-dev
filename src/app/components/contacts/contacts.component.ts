import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  users: any;
  userId: any;
  constructor(private auth: AuthService, private route: Router) {
    this.userId = localStorage.getItem('userId');
   }

  ngOnInit() {

    this.auth.getUsers().subscribe((r) => {
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
    })
  }

  navigateToChat(user) {
    this.route.navigateByUrl('/chat/'+user.id);
  }

}
