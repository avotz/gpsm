import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {NetworkServiceProvider} from '../../providers/network-service/network-service';
import {AuthServiceProvider} from '../../providers/auth-service/auth-service';
import { NewPasswordPage } from './new-password';


@Component({
  selector: 'page-password-reset',
  templateUrl: 'password-reset.html',
})
export class PasswordResetPage {
  errorAuth;
  phone;
  passwordForm: FormGroup;
  submitAttempt: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider, public loadingCtrl: LoadingController, public formBuilder: FormBuilder, public networkService: NetworkServiceProvider, public toastCtrl: ToastController) {

  	   this.navCtrl = navCtrl;
       this.authService = authService;
       this.loadingCtrl = loadingCtrl;
       this.passwordForm = formBuilder.group({
        phone: ['',Validators.required],
      
        
      });
  }

//    createAccount(){

//      this.navCtrl.push(RegisterPage);   

//    }

   send() {
    
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else { 
     
        this.submitAttempt = true;
        let loader = this.loadingCtrl.create({
          content: "Espere por favor...",
          //duration: 3000
        });

      
        if (this.passwordForm.valid){
          loader.present();
            this.authService.sendResetCode(this.passwordForm.value)
                  .then(data => {

                    loader.dismiss();
                   
                      let message = data.message;

                      let toast = this.toastCtrl.create({
                          message: message,
                          cssClass: 'mytoast error',
                          duration: 3000
                      });

                      toast.present(toast);
            
                   
                    this.navCtrl.push(NewPasswordPage);  
                        

                  })
                  .catch(error => {

                    let message = 'Ha ocurrido un error enviando el codigo';

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

  

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
