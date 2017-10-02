import { Component } from '@angular/core';
import { Platform, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReviewServiceProvider } from '../../providers/review-service/review-service';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';


@Component({
  selector: 'page-review',
  templateUrl: 'review.html',
})
export class ReviewPage {
 
  reviewForm: FormGroup;
  errorAuth;

  submitAttempt: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public reviewService: ReviewServiceProvider, public loadingCtrl: LoadingController, public formBuilder: FormBuilder, public toastCtrl: ToastController, public platform: Platform, public networkService: NetworkServiceProvider) {

    this.navCtrl = navCtrl;
   
    this.reviewForm = formBuilder.group({
      comment: ['', Validators.required],
     

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

  
  send() {
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else {
      this.submitAttempt = true;
      let message = 'Comentario enviado Correctamente';
      let styleClass = 'success';

      if (this.reviewForm.valid) {


        let loader = this.loadingCtrl.create({
          content: "Espere por favor...",
          //duration: 3000
        });

        loader.present();

        this.reviewService.send(this.reviewForm.value)
          .then(data => {

            loader.dismiss();
            console.log(data);
            if (data.error) {
              this.errorAuth = data.error;
              return;
            }


            
            this.presentToast(message, styleClass)

            
            this.errorAuth = "";
            this.submitAttempt = false;
            this.clearForm(this.reviewForm);
            


          })
          .catch(error => {

            alert(error)
            this.submitAttempt = false;

            loader.dismiss();
          });
      }
    }
  }

  clearForm(form) {

    //form.get('password').setValue('')
    form.reset()

  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad ReviewPage');
  }



}
