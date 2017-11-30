import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AuthServiceProvider} from '../../providers/auth-service/auth-service';
import { PasswordValidator } from '../../validators/password';
import { HomePage } from '../home/home';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';



@Component({
  selector: 'page-new-password',
    templateUrl: 'new-password.html',
})
export class NewPasswordPage {
  resetForm: FormGroup;
  errorAuth;
  tags;
  errorSave;
  /*name;
  email;
  password;
  password_confirmation;*/
  submitAttempt: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,public authService: AuthServiceProvider, public loadingCtrl: LoadingController, public formBuilder: FormBuilder, public networkService: NetworkServiceProvider, public toastCtrl: ToastController) {

  	   this.navCtrl = navCtrl;
       this.authService = authService;

       this.resetForm = formBuilder.group({
        phone: ['', Validators.required],
        code: ['', Validators.required],
        password: ['',Validators.required],
        password_confirmation: ['',Validators.required]
      },{
      validator: PasswordValidator.MatchPassword // your validation method
    });
  }

    resetPassword(){

    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else {
    this.submitAttempt = true;
 
    if(this.resetForm.valid){
      
 
     let loader = this.loadingCtrl.create({
        content: "Espere por favor...",
        //duration: 3000
      });

    loader.present();
   
     this.authService.resetPassword(this.resetForm.value)
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

              let message = 'Ha ocurrido un error reseteando la contraseña.';
              let errorSaveText = error.statusText;
              let errorSaveTextPhone = error.statusText;

              if (error.status == 422) {
                errorSaveText = "";
                errorSaveTextPhone = "";
                let body = JSON.parse(error._body)

                if (body.errors.code)
                  errorSaveText = body.errors.code[0]
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

  
  ionViewDidLoad() {
    console.log('ionViewDidLoad newPasswordPage');
  }



}
