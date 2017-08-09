import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import {Facebook} from '@ionic-native/facebook';
import {GooglePlus } from '@ionic-native/google-plus';

import {AuthServiceProvider} from '../../providers/auth-service/auth-service';
import { RegisterPage } from '../register/register';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  errorAuth;
  email;
  password;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider, public loadingCtrl: LoadingController, private fb:Facebook, private gp:GooglePlus) {

  	   this.navCtrl = navCtrl;
       this.authService = authService;
       this.loadingCtrl = loadingCtrl;
  }

   createAccount(){

     this.navCtrl.push(RegisterPage);   

   }

   loginForm() {

     let loader = this.loadingCtrl.create({
        content: "Espere por favor...",
        //duration: 3000
      });

    loader.present();
     
     this.authService.login(this.email, this.password)
            .then(data => {

               loader.dismiss();
               console.log(data);
               if(data.error)
              {
                this.errorAuth = data.error;
                return;
              }
      
              window.localStorage.setItem('token', data.access_token);
              window.localStorage.setItem('login_type', 'email');
              window.localStorage.setItem('auth_user', JSON.stringify(data.user));

              this.errorAuth = "";
              this.navCtrl.setRoot(HomePage);   

            })
            .catch(error => {

                alert(error)
              
               loader.dismiss();
            });
    
  }

   loginFacebook(){
        this.fb.login(['public_profile', 'email'])
        .then(rta => {
          console.log(rta.status)
          let access_token = rta.authResponse.accessToken;
          if(rta.status == 'connected'){
            this.fb.api("/me?fields=id,name,email,first_name,last_name,gender",['public_profile','email'])
            .then(rta=>{
              console.log(rta);
              this.registerFromFB(rta, access_token);
                   
            })
            .catch(error =>{
              console.error( error );
            });
          };
        })
        .catch(error =>{
          console.error( error );
        });
   }
   
   loginGoogle() {
      this.gp.login(
          {
              'scopes': '',
              'webClientId': '',
              'offline': false
          }
      ).then(
          (success) => {

              this.registerFromGoogle(success);
              /*alert(  '\n id: ' + JSON.stringify(success.userId) +
                      '\n name: ' + JSON.stringify(success.displayName) +
                      '\n email: ' + JSON.stringify(success.email) +
                      '\n data: ' + JSON.stringify(success)
              );*/

          },
          (failure) => {
              console.log('GOOGLE+ login FAILED', failure);
          }
      );
  }

  registerFromFB(data, access_token) {
        this.authService.registerSocial(data.name, data.email, access_token)
        .then(data => {

               console.log(data);
                
                
                window.localStorage.setItem('token', data.access_token);
                window.localStorage.setItem('login_type', 'facebook');
                
                this.navCtrl.push(HomePage);    

            })
            .catch(error => alert(error));
         
    }

  registerFromGoogle(data) {
        this.authService.registerSocial(data.displayName, data.email, '')
        .then(data => {

               console.log(data);
              
              
              window.localStorage.setItem('token', data.access_token);
              window.localStorage.setItem('login_type', 'google');
              
              this.navCtrl.push(HomePage);        

            })
            .catch(error => alert(error));
        
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
