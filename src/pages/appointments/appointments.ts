import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController, ToastController, ActionSheetController } from 'ionic-angular';
import { AppointmentServiceProvider } from '../../providers/appointment-service/appointment-service';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
import { ModalReservationPage } from '../medic-calendar/modal-reservation';
import moment from 'moment'
import { SERVER_URL } from '../../providers/config';

@Component({
  selector: 'page-appointments',
  templateUrl: 'appointments.html',
})
export class AppointmentsPage {

  serverUrl: String = SERVER_URL;
  scheduledAppointments: any = [];
  authUser: any;
  submitAttempt: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public appointmentService: AppointmentServiceProvider, public loadingCtrl: LoadingController, public modalCtrl: ModalController, public toastCtrl: ToastController, public actionSheetCtrl: ActionSheetController, public networkService: NetworkServiceProvider) {

    this.navCtrl = navCtrl;
    this.authUser = JSON.parse(window.localStorage.getItem('auth_user'));

    this.getAppointmentsFromUser();

  }

 
  openAppointmentDetail(item) {
    item.medic = item.user
    item.fromScheduledAppointments = true;
    item.delete_id = item.id;
    item.show = true;
    let modal = this.modalCtrl.create(ModalReservationPage, item);
    modal.onDidDismiss(data => {

      if (data.date)
        this.getAppointmentsFromUser();
        
      if(data.toHome)
        this.goHome()

    });

    modal.present();
  }
  deleteAppointment(item) {
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else {
      let loader = this.loadingCtrl.create({
        content: "Espere por favor...",

      });

      loader.present();
      this.appointmentService.delete(item.id)
        .then(data => {
          console.log(data)
          let index = this.scheduledAppointments.indexOf(item)
          this.scheduledAppointments.splice(index, 1);


          loader.dismiss();


        })
        .catch(error => {
          let message = 'Ha ocurrido un error eliminado el paciente';

          if (error.status == 403)
            message = 'No se puede eliminar paciente por que tiene citas iniciadas';

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
  getAppointmentsFromUser() {
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
  } else {
    let loader = this.loadingCtrl.create({
      content: "Espere por favor...",

    });

    loader.present();
    this.appointmentService.getAppointments()
      .then(data => {
        
        console.log(data)
        this.scheduledAppointments = data.scheduledAppointments;
        loader.dismiss();


      })
      .catch(error => {
        let message = 'Ha ocurrido un error en consultado tus pacientes ';

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
  
  timeFormat(date) {
    return moment(date).format('h:mm A');
  }
  dateFormat(date) {
    return moment(date).format('YYYY-MM-DD');
  }
  goHome(){
    this.navCtrl.popToRoot();
   
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad appointmentPage');
  }

}
