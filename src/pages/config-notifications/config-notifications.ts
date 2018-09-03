import { Component } from '@angular/core';
import { Platform, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'page-config-notifications',
  templateUrl: 'config-notifications.html',
})
export class ConfigNotificationsPage {
 
  configNotiForm: FormGroup;
  //rate:any;
  errorAuth;
  user: any;
  submitAttempt: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider, public loadingCtrl: LoadingController, public formBuilder: FormBuilder, public toastCtrl: ToastController, public platform: Platform, public networkService: NetworkServiceProvider) {

    this.navCtrl = navCtrl;
    this.user = JSON.parse(window.localStorage.getItem('auth_user'));
    
    this.configNotiForm = formBuilder.group({
      configNotiPharmacy: [this.user.pharmacy_notifications, Validators.required],
      configNotiClinic: [this.user.clinic_notifications, Validators.required],
     

    });
  }

 
  

  private presentToast(text, styleClass) {
    let toast = this.toastCtrl.create({
      message: text,
      cssClass: 'mytoast '+ styleClass,
      duration: 3000
    });
    toast.present();
  }

  onRateChange(event){

    console.log(event)

  }
  
  save() {
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else {
      this.submitAttempt = true;
      let message = 'Configuracion Guarada';
      let styleClass = 'success';

      if (this.configNotiForm.valid) {


        let loader = this.loadingCtrl.create({
          content: "Espere por favor...",
          //duration: 3000
        });

        loader.present();

        this.authService.saveConfigNotifications(this.configNotiForm.value)
          .then(data => {

            loader.dismiss();
            console.log(data);
            if (data.error) {
              this.errorAuth = data.error;
              return;
            }

            window.localStorage.setItem('auth_user', JSON.stringify(data));


            
            this.presentToast(message, styleClass)

            
            this.errorAuth = "";
            this.submitAttempt = false;
            
            


          })
          .catch(error => {

            let message = 'Ha ocurrido un error enviando la encuesta';

            let toast = this.toastCtrl.create({
              message: message,
              cssClass: 'mytoast error',
              duration: 3000
            });

            toast.present(toast);
            loader.dismiss();
            this.submitAttempt = false;

           
          });
      }
    }
  }

  



  ionViewDidLoad() {
    console.log('ionViewDidLoad ReviewPage');
  }



}
