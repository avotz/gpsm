import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AuthServiceProvider} from '../../providers/auth-service/auth-service';






@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {
  accountForm: FormGroup;
  errorAuth;
  tags;
  user:any;
 
  submitAttempt: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,public authService: AuthServiceProvider, public loadingCtrl: LoadingController, public formBuilder: FormBuilder, public toastCtrl: ToastController) {

  	   this.navCtrl = navCtrl;
       this.user = JSON.parse(window.localStorage.getItem('auth_user'));

       this.accountForm = formBuilder.group({
        name: [this.user.name,Validators.required],
        email: [this.user.email,Validators.required],
        password: ['',Validators.minLength(6)]
       
      });
  }

   update(){

     this.submitAttempt = true;
     let message ='Cuenta Actualizada Correctamente';
     let styleClass ='success';

    if(this.accountForm.valid){
      
 
     let loader = this.loadingCtrl.create({
        content: "Espere por favor...",
        //duration: 3000
      });

    loader.present();
   
     this.authService.update(this.accountForm.value)
            .then(data => {

               loader.dismiss();
               console.log(data);
               if(data.error)
              {
                this.errorAuth = data.error;
                return;
              }
      
             
             window.localStorage.setItem('auth_user', JSON.stringify(data));
             

              let toast = this.toastCtrl.create({
                message: message,
                cssClass: 'mytoast '+ styleClass,
                duration: 3000
            });
              toast.present(toast);
              this.errorAuth = "";
              this.clearForm(this.accountForm);
             
            

            })
            .catch(error => {

                alert(error)
              
               loader.dismiss();
            });
      }
  }

  clearForm(form){
    
     form.get('password').setValue('')
     
   
   }

  

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }



}
