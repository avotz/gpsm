import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Facebook} from '@ionic-native/facebook';
import {GooglePlus } from '@ionic-native/google-plus';
import {AuthServiceProvider} from '../../providers/auth-service/auth-service';
import { PasswordValidator } from '../../validators/password';
import { HomePage } from '../home/home';
import { RegisterPatientPage } from '../register-patient/register-patient';



@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  registerForm: FormGroup;
  errorAuth;
  tags;
  /*name;
  email;
  password;
  password_confirmation;*/
  submitAttempt: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,public authService: AuthServiceProvider, public loadingCtrl: LoadingController, private fb:Facebook, private gp:GooglePlus, public formBuilder: FormBuilder) {

  	   this.navCtrl = navCtrl;
       this.authService = authService;

       this.registerForm = formBuilder.group({
        name: ['',Validators.required],
        email: ['',Validators.required],
        password: ['',Validators.required],
        password_confirmation: ['',Validators.required]
      },{
      validator: PasswordValidator.MatchPassword // your validation method
    });
  }

   newAccount(){

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
             

              this.errorAuth = "";
              this.navCtrl.push(RegisterPatientPage,{
                    name: data.user.name, email:  data.user.email
                });   
             
            

            })
            .catch(error => {

                alert(error)
              
               loader.dismiss();
            });
      }
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
    console.log('ionViewDidLoad RegisterPage');
  }



}
