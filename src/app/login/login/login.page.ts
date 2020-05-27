import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  [x: string]: any;

  public usuari = {
    correu: '',
    contrassenya: ''
  };

  loggedIn: boolean;

  constructor(private auth: AuthService) {}

  ngOnInit() {

    this.auth.user.subscribe((res) => {
      console.log(res);
      this.loggedIn = res!=null;
    })

  }

  login(){
    this.auth.login(this.usuari.correu, this.usuari.contrassenya);
  }

  loginGoogle(){
    this.auth.loginGoogle();
  }

  logout() {
    this.auth.logout();
  }

}
