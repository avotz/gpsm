import { Component } from '@angular/core';
import { Platform, NavParams, ViewController, ToastController, LoadingController } from 'ionic-angular';
import {PatientServiceProvider} from '../../providers/patient-service/patient-service';
import {AppointmentServiceProvider} from '../../providers/appointment-service/appointment-service';
import moment from 'moment'
@Component({
  selector: 'modal-reservation',
  templateUrl: 'modal-reservation.html',
})
export class ModalReservationPage {
  
  appointment: any;
  clinic: any;
  medic: any;
  reminder: any;
  authUser: any;
  patients: any[] = [];
  patientSelected: any;
  patientIdSelected: any;
  reminder_time: string = "02:00:00";
  isWaiting: boolean = null;
  constructor(public platform: Platform, public navParams: NavParams, public viewCtrl: ViewController,public toastCtrl: ToastController, public patientService: PatientServiceProvider, public appointmentService: AppointmentServiceProvider, public loadingCtrl: LoadingController) {
    
    this.appointment = this.navParams.data;
    this.medic = this.appointment.medic;
    this.clinic = this.appointment.office;

    this.authUser = JSON.parse(window.localStorage.getItem('auth_user'));
    
    this.getPatientsFromUser();

    
  }

  getPatientsFromUser(){
    this.patientService.findAllByUser(this.authUser.id)
    .then(data => {
       console.log(data)
       this.patients = data;

       if(this.patients.length)
            this.patientSelected = this.patients[0];
            this.patientIdSelected = this.patientSelected.id;
        
         
     })
     .catch(error => alert(JSON.stringify(error)));
  }
  saveReminder(){
    let message ='Recordatorio Creado Correctamente';
    let styleClass ='success';
    this.isWaiting = true;
    this.appointmentService.saveReminder(this.appointment.id, this.reminder_time)
    .then(data => {
        console.log(data)
        
        if(data.error)
        {
            message =  data.error.message;
            styleClass = 'error';
        }
        
        let toast = this.toastCtrl.create({
            message: message,
            cssClass: 'mytoast '+ styleClass,
            duration: 3000
        });
        toast.present(toast);
        this.reminder = data.id
        this.isWaiting = null;

      })
      .catch(error => alert(JSON.stringify(error)));
  }
  saveAppointment(){
    let message ='Cita Reservada Correctamente';
    let styleClass ='success';
    let appointment = {
        title : 'cita',
        date : this.appointment.startFormatted,
        start : this.appointment.start,
        end : this.appointment.end,
        backgroundColor: '#337ab7', //Success (green)
        borderColor: '#337ab7',
        user_id: this.appointment.medic_id,
        patient_id: (this.patientIdSelected) ? this.patientIdSelected : 0,
        office_id: (this.appointment.office_id) ? this.appointment.office_id : 0,
        allDay: 0
        
      };
    
     this.isWaiting = true;
    this.appointmentService.save(appointment)
    .then(data => {
        console.log(data)
        
        if(data.error)
        {
            message =  data.error.message;
            styleClass = 'error';
        }
        
        let toast = this.toastCtrl.create({
            message: message,
            cssClass: 'mytoast '+ styleClass,
            duration: 3000
        });
        toast.present(toast);

        if(data.appointment)
            this.appointment = data.appointment;

        this.isWaiting = null;

      })
      .catch(error => alert(JSON.stringify(error)));
  }
  parseDate(date){
      return moment(date).format('YYYY-MM-DD HH:mm');
  }
  dismiss() {
    let data = { date: this.appointment.date };

   // if(this.appointment.id)
        this.viewCtrl.dismiss(data);
   // else
   //     this.viewCtrl.dismiss();
  }

}
