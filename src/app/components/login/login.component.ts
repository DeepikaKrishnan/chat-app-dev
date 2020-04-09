import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
 
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: any;
  page = 'login';

  constructor(private fb: FormBuilder, private auth: AuthService, private route: Router) { 
    this.loginForm = this.fb.group({
      email: ["", [Validators.required,Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]]
    })
  }

  ngOnInit(): void {

  }

  submit() {
    const user = {
      email: this.loginForm.controls.email.value,
      password: this.loginForm.controls.password.value,
      authenticated: true
    }
    if (this.page == "login") {
      this.auth.doLogin(user).subscribe((r)=> {
        if(r.docs && r.docs.length) {
          const id = r.docs[0].id;
          this.auth.updateAuth(id, true).then(() => {
          localStorage.setItem('userId', id);
          this.route.navigateByUrl('/contacts');
          });
        } else {
          alert('Invalid Email or Password')
        }
      })
    } else if (this.page == "register") {
        this.auth.doRegister(user).then((r) => {
          localStorage.setItem('userId', r.id);
          this.route.navigateByUrl('/contacts');
          //this.auth.userId = r.id
        });
    }
  }

}
