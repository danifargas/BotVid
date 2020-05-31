import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';



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

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {

  }

  login(){
    this.auth.login(this.usuari.correu, this.usuari.contrassenya)
      .then(value => {
        this.router.navigate(["chat"], { replaceUrl: true});
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
      });
  }

  loginGoogle(){
    this.auth.loginGoogle()
    .then(value => {
      this.router.navigate(["chat"], { replaceUrl: true});
    })
    .catch(err => {
      console.log('Something went wrong:',err.message);
    });
  }

}
