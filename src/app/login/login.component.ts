import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { OmsService } from '../_services/oms.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginform: FormGroup;
  submitted = false;
  submiterr: boolean = false;
  submitmessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private oms: OmsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loginform = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      remember: [false]
    });
  }

  get f() {
    return this.loginform.controls;
  }

  login() {
    this.submitted = true;
    console.log(this.loginform.value);
    if (this.loginform.invalid)
      return;
    this.oms.login(this.loginform.value)
      .subscribe(data => {
        if (data.userid) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userid", data.userid);
          this.router.navigate(['dashboard']);
        } else {
          console.log(data.error);
          this.submitmessage = data.error;
          this.submiterr = true;
        }
      });
  }
}
