import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  loggedIn: boolean;

  constructor(
    private auth: AuthService
  ) {}


  ngOnInit(){

    this.auth.user.subscribe((res) => {
      console.log(res);
      this.loggedIn = res!=null;
    })

    //this.auth.signup("danifargas@outlook.com", "123456");
  }

  login(){
    this.auth.login("danifargas@outlook.com", "123456");
  }

  loginGoogle(){
    this.auth.loginGoogle();
  }

  logout() {
    this.auth.logout();
  }

}
