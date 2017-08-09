import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';

@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html',
})
export class LandingPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  showRegister(){

     this.navCtrl.push(RegisterPage);   

   }
  showLogin(){

     this.navCtrl.push(LoginPage);   

   }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LandingPage');
  }

}
