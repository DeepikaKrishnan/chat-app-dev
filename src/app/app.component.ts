import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'angular-chat';
  sub: any;
  constructor(private router: Router) {
    this.sub = this.router.events.subscribe((route) => {
      const id = localStorage.getItem('userId');
      if(route['url'] === '/login' && id) {
        this.router.navigateByUrl('/contacts');
      } else if (route['url'] !== '/login' && !id) {
        this.router.navigateByUrl('/login');
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
