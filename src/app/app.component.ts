import { OmsService } from './_services/oms.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'oms2';
  constructor(
    private oms: OmsService,
    private router: Router
  ) { }

  logout() {
    this.oms.logout();
    this.router.navigate(['login']);
    console.log("Logout successful")
  }
}
