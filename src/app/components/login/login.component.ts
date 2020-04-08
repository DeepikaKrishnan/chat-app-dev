import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
 
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: any;

  constructor(private fb: FormBuilder) { 
    this.loginForm = this.fb.group({
      email: ["", [Validators.required,Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]]
    })
  }

  ngOnInit(): void {
    
  }

}
