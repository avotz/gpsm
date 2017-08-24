import { Component } from '@angular/core';
import { Platform, NavParams, ViewController, ToastController, LoadingController } from 'ionic-angular';
import {PatientServiceProvider} from '../../providers/patient-service/patient-service';
import {AppointmentServiceProvider} from '../../providers/appointment-service/appointment-service';
import moment from 'moment'
@Component({
  selector: 'modal-appointment',
  templateUrl: 'modal-appointment.html',
})
export class ModalAppointmentPage {
  shownGroup = null;
  appointment: any;
  authUser: any;
  isWaiting: boolean = null;
  vitalSigns:any;
  disease_notes: string = "reason";
  diagnostics_treatments: string = "diagnostics";
  constructor(public platform: Platform, public navParams: NavParams, public viewCtrl: ViewController,public toastCtrl: ToastController, public patientService: PatientServiceProvider, public appointmentService: AppointmentServiceProvider, public loadingCtrl: LoadingController) {
    
    this.appointment = this.navParams.data;
   

    this.authUser = JSON.parse(window.localStorage.getItem('auth_user'));
    
    let loader = this.loadingCtrl.create({
        content: "Espere por favor...",
        
        });
    
    loader.present();
    this.appointmentService.findById(this.appointment.id)
    .then(resp => {
        this.appointment = resp.appointment;
        this.vitalSigns = resp.vitalSigns;
        this.isWaiting = null;
        loader.dismissAll();
    })
    .catch(error => alert(JSON.stringify(error)));
    
  
    
  }
  toggleGroup(group) {
    if (this.isGroupShown(group)) {
        this.shownGroup = null;
    } else {
        this.shownGroup = group;
    }
  }
  isGroupShown(group) {
      return this.shownGroup === group;
  }

  parseDate(date){
      return moment(date).format('YYYY-MM-DD HH:mm');
  }
  timeFormat(date){
    return moment(date).format('h:mm A');
  }
  dateFormat(date){
    return moment(date).format('YYYY-MM-DD');
  }
  dismiss() {
 
    this.viewCtrl.dismiss();
  
  }

}
