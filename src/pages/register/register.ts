import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Facebook} from '@ionic-native/facebook';
import {GooglePlus } from '@ionic-native/google-plus';
import {AuthServiceProvider} from '../../providers/auth-service/auth-service';
import { PasswordValidator } from '../../validators/password';
import { HomePage } from '../home/home';
import { RegisterPatientPage } from '../register-patient/register-patient';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';



@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  registerForm: FormGroup;
  errorAuth;
  tags;
  errorSave;
  /*name;
  email;
  password;
  password_confirmation;*/
  submitAttempt: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,public authService: AuthServiceProvider, public loadingCtrl: LoadingController, private fb:Facebook, private gp:GooglePlus, public formBuilder: FormBuilder, public networkService: NetworkServiceProvider, public toastCtrl: ToastController) {

  	   this.navCtrl = navCtrl;
       this.authService = authService;

       this.registerForm = formBuilder.group({
        name: ['',Validators.required],
        phone: ['', Validators.required],
        email: [''],
        password: ['',Validators.required],
        password_confirmation: ['',Validators.required]
      },{
      validator: PasswordValidator.MatchPassword // your validation method
    });
  }

   newAccount(){

    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else {
    this.submitAttempt = true;
 
    if(this.registerForm.valid){
      
 
     let loader = this.loadingCtrl.create({
        content: "Espere por favor...",
        //duration: 3000
      });

    loader.present();
   
     this.authService.register(this.registerForm.value)
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
              this.navCtrl.push(RegisterPatientPage,{
                name: data.user.name, email: data.user.email, phone: data.user.phone
                });   
             
            

            })
            .catch(error => {

              let message = 'Ha ocurrido un error registrando al usuario.';
              let errorSaveText = error.statusText;
              let errorSaveTextPhone = error.statusText;

              if (error.status == 422) {
                errorSaveText = "";
                errorSaveTextPhone = "";
                let body = JSON.parse(error._body)

                if (body.errors.email)
                  errorSaveText = body.errors.email[0]
                if (body.errors.phone)
                  errorSaveTextPhone = body.errors.phone[0]

                message = message + errorSaveText + ' ' + errorSaveTextPhone

              }

              let toast = this.toastCtrl.create({
                message: message,
                cssClass: 'mytoast error',
                duration: 4500
              });

              toast.present(toast);
             

              this.errorSave = message;
              console.log(error);
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
        this.authService.registerSocial(data.name, data.email, access_token)
        .then(data => {

               console.log(data);
                
                
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
            .catch(error => alert(error));
         
    }

  registerFromGoogle(data) {
        this.authService.registerSocial(data.displayName, data.email, '')
        .then(data => {

               console.log(data);
              
              
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
            .catch(error => alert(error));
        
    }


  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }



}
