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

  /*doLogin(){
    this.loginService.doLogin(this.usuari).subscribe((res: LoginResponse) => {
      if (!res.doLogin){
        this.showMsgInvalidLogin = true;
      }else{
        this.showMsgInvalidLogin = false;
        this.updateStoredLogin(res.idUsuari);
      }
    });
  }*/

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
