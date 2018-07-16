import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController, ToastController, ActionSheetController, Events } from 'ionic-angular';

import { NetworkServiceProvider } from '../../providers/network-service/network-service';
import { SERVER_URL } from '../../providers/config';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Badge } from '@ionic-native/badge';

@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {

  serverUrl: String = SERVER_URL;
  patients: any = [];
  authUser: any;
  submitAttempt: boolean = false;
  notifications: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider, public loadingCtrl: LoadingController, public modalCtrl: ModalController, public toastCtrl: ToastController, public actionSheetCtrl: ActionSheetController, public networkService: NetworkServiceProvider, public badge: Badge, public events: Events) {

    this.navCtrl = navCtrl;
    this.authUser = JSON.parse(window.localStorage.getItem('auth_user'));

    this.getNotificationsFromUser();

  }

  getNotificationsFromUser() {

    // this.notifications = JSON.parse(window.localStorage.getItem('notifications'));
    // alert(window.localStorage.getItem('notifications'));
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
  } else {
    let loader = this.loadingCtrl.create({
      content: "Espere por favor...",

    });

    loader.present();
      this.authService.getNotifications()
      .then(data => {
        console.log(data)
        this.notifications = data;
        loader.dismiss();
        this.badge.clear();
        this.events.publish('notifications:clear', 0);

      })
      .catch(error => {
        let message = 'Ha ocurrido un error en consultado tus notificaciones ';

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

  showImage(media) {
    //let d = new Date();
    return media;//`${this.serverUrl}/storage/${media}`;

  }
  refresh() {
    this.getNotificationsFromUser();
  }

  goHome(){
    this.navCtrl.popToRoot();
   
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationsPage');
  }

}
