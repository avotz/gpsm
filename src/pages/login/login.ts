import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Facebook} from '@ionic-native/facebook';
import {GooglePlus } from '@ionic-native/google-plus';
import {NetworkServiceProvider} from '../../providers/network-service/network-service';
import {AuthServiceProvider} from '../../providers/auth-service/auth-service';
import { RegisterPage } from '../register/register';
import { RegisterPatientPage } from '../register-patient/register-patient';
import { HomePage } from '../home/home';
import { PasswordResetPage } from './password-reset';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  errorAuth;
  email;
  phone_number;
  password;
  loginForm: FormGroup;
  submitAttempt: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider, public loadingCtrl: LoadingController, private fb: Facebook, private gp: GooglePlus, public formBuilder: FormBuilder, public networkService: NetworkServiceProvider, public toastCtrl: ToastController) {

  	   this.navCtrl = navCtrl;
       this.authService = authService;
       this.loadingCtrl = loadingCtrl;
       this.loginForm = formBuilder.group({
        phone_number: ['',Validators.required],
        password: ['',Validators.required]
        
      });
  }

   createAccount(){

     this.navCtrl.push(RegisterPage);   

   }
  forgetPassword(){
    this.navCtrl.push(PasswordResetPage);   
  }

   login() {
    
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else { 
     
        this.submitAttempt = true;
        let loader = this.loadingCtrl.create({
          content: "Espere por favor...",
          //duration: 3000
        });

      
        if(this.loginForm.valid){
          loader.present();
          this.authService.login(this.loginForm.value.phone_number, this.loginForm.value.password)
                  .then(data => {

                    loader.dismiss();
                    console.log(data);
                    if(data.error)
                    {
                      this.errorAuth = data.error == 'Unauthenticated' ? 'Estas Credenciales no corresponden a ningun usuario registrado. Verifica!': data.error;
                      return;
                    }
            
                    window.localStorage.setItem('token', data.access_token);
                    window.localStorage.setItem('login_type', 'email');
                    window.localStorage.setItem('auth_user', JSON.stringify(data.user));
                    
                    this.errorAuth = "";
                    //this.navCtrl.setRoot(HomePage);

                    if(data.patients)
                      this.navCtrl.setRoot(HomePage);
                    else {
                        this.navCtrl.push(RegisterPatientPage,{
                          name: data.user.name, email: data.user.email, phone_country_code: data.user.phone_country_code, phone: data.user.phone_number
                      });  
                    }      

                  })
                  .catch(error => {

                    let message = 'Ha ocurrido un error iniciando sesion';

                    let toast = this.toastCtrl.create({
                      message: message,
                      cssClass: 'mytoast error',
                      duration: 3000
                    });

                    toast.present(toast);
                    loader.dismiss();
                  });
        }
    }
        
  }

   loginFacebook(){
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else { 
      
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
   }
   
   loginGoogle() {
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else {  
      
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
  }

  registerFromFB(data, access_token) {
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else {     
      let loader = this.loadingCtrl.create({
        content: "Espere por favor...",
        //duration: 3000
      });
      loader.present();
      this.authService.registerSocial(data.first_name, data.email, access_token)
          .then(data => {
            loader.dismiss();
                console.log(data);

                if(data.error)
                {
                  this.errorAuth = data.error == 'Unauthenticated' ? 'Estas Credenciales no corresponden a ningun usuario registrado. Verifica!': data.error;
                  return;
                }
                  
                  
                  window.localStorage.setItem('token', data.access_token);
                  window.localStorage.setItem('login_type', 'facebook');
                  window.localStorage.setItem('auth_user', JSON.stringify(data.user));
                
                  if(data.patients)
                    this.navCtrl.setRoot(HomePage);
                  else {
                      this.navCtrl.push(RegisterPatientPage,{
                        name: data.user.name, email:  data.user.email
                    });  
                  }    

              })
              .catch(error =>{
                loader.dismiss();
                let message = 'Ha ocurrido un error en el registro desde una red social.';
                let errorSaveText = error.statusText;
                let errorSaveTextPhone = error.statusText;
               
                if (error.status == 422) {
                  errorSaveText = "";
                  errorSaveTextPhone = "";
                  let body = JSON.parse(error._body)

                  if (body.errors.email)
                    errorSaveText = body.errors.email[0]
                  if (body.errors.phone_number)
                    errorSaveTextPhone = body.errors.phone_number[0]

                  message = message + errorSaveText + ' ' + errorSaveTextPhone

                }

             

                let toast = this.toastCtrl.create({
                  message: message,
                  cssClass: 'mytoast error',
                  duration: 4500
                });

                toast.present(toast);




              });
        }
    }

  registerFromGoogle(data) {
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else {   
      let loader = this.loadingCtrl.create({
        content: "Espere por favor...",
        //duration: 3000
      });
      loader.present();
      this.authService.registerSocial(data.displayName, data.email, '')
          .then(data => {
            loader.dismiss();

                console.log(data);
                if(data.error)
                    {
                      this.errorAuth = data.error == 'Unauthenticated' ? 'Estas Credenciales no corresponden a ningun usuario registrado. Verifica!': data.error;
                      return;
                    }
                
                
                window.localStorage.setItem('token', data.access_token);
                window.localStorage.setItem('login_type', 'google');
                window.localStorage.setItem('auth_user', JSON.stringify(data.user));
                
                if(data.patients)
                  this.navCtrl.setRoot(HomePage);
                else {
                    this.navCtrl.push(RegisterPatientPage,{
                      name: data.user.name, email:  data.user.email
                  });  
                }    

              })
              .catch(error => {
                loader.dismiss();
                let message = 'Ha ocurrido un error en el registro desde una red social.';
                let errorSaveText = error.statusText;
                let errorSaveTextPhone = error.statusText;
               
                if (error.status == 422) {
                  errorSaveText = "";
                  errorSaveTextPhone = "";
                  let body = JSON.parse(error._body)

                  if (body.errors.email)
                    errorSaveText = body.errors.email[0]
                  if (body.errors.phone_number)
                    errorSaveTextPhone = body.errors.phone_number[0]

                  message = message + errorSaveText + ' ' + errorSaveTextPhone

                }



                let toast = this.toastCtrl.create({
                  message: message,
                  cssClass: 'mytoast error',
                  duration: 4500
                });

                toast.present(toast);
                
              });
          }
        
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
