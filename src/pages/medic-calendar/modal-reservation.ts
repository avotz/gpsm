import { Component } from '@angular/core';
import { Platform, NavParams, ViewController, ToastController, LoadingController, NavController } from 'ionic-angular';
import { PatientServiceProvider } from '../../providers/patient-service/patient-service';
import { AppointmentServiceProvider } from '../../providers/appointment-service/appointment-service';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';

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

    constructor(public platform: Platform, public navParams: NavParams, public viewCtrl: ViewController, public toastCtrl: ToastController, public patientService: PatientServiceProvider, public appointmentService: AppointmentServiceProvider, public loadingCtrl: LoadingController, public networkService: NetworkServiceProvider, public navCtrl: NavController) {

        this.appointment = this.navParams.data;
        this.medic = this.appointment.medic;
        this.clinic = this.appointment.office;
        console.log(this.appointment)
        this.authUser = JSON.parse(window.localStorage.getItem('auth_user'));

        this.getPatientsFromUser();


    }

    getPatientsFromUser() {
        if (this.networkService.noConnection()) {
            this.networkService.showNetworkAlert();
        } else {
            this.isWaiting = true;
            this.patientService.findAllByUser(this.authUser.id)
                .then(data => {
                    console.log(data)
                    this.patients = data;

                    if (this.patients.length) {
                        this.patientSelected = this.patients[0];
                        this.patientIdSelected = this.patientSelected.id;
                        this.isWaiting = null;
                    }




                })
                .catch(error => {

                    let message = 'Ha ocurrido un error cargando los pacientes';

                    let toast = this.toastCtrl.create({
                        message: message,
                        cssClass: 'mytoast error',
                        duration: 3000
                    });

                    toast.present(toast);
                   
                    this.isWaiting = null;

                });
        }
    }
    saveReminder() {
        if (this.networkService.noConnection()) {
            this.networkService.showNetworkAlert();
        } else {
            let message = 'Recordatorio Creado Correctamente';
            let styleClass = 'success';
            this.isWaiting = true;
            this.appointmentService.saveReminder(this.appointment.id, this.reminder_time)
                .then(data => {
                    console.log(data)

                    if (data.error) {
                        message = data.error.message;
                        styleClass = 'error';
                    }

                    let toast = this.toastCtrl.create({
                        message: message,
                        cssClass: 'mytoast ' + styleClass,
                        duration: 3000
                    });
                    toast.present(toast);
                    this.reminder = data.id
                    this.isWaiting = null;

                })
                .catch(error => {

                    let message = 'Ha ocurrido un error guardando el recordatorio';

                    let toast = this.toastCtrl.create({
                        message: message,
                        cssClass: 'mytoast error',
                        duration: 3000
                    });

                    toast.present(toast);
                   
                    this.isWaiting = null;

                });
        }
    }
    saveAppointment() {
        if (this.networkService.noConnection()) {
            this.networkService.showNetworkAlert();
        } else {
            let message = 'Cita Reservada Correctamente';
            let styleClass = 'success';
            let appointment = {
                title: 'cita',
                date: moment(this.appointment.startFormatted).format('YYYY-MM-DD'),
                start: this.appointment.start,
                end: this.appointment.end,
                backgroundColor: '#374850', //Success (green)
                borderColor: '#374850',
                user_id: this.appointment.medic_id,
                patient_id: (this.patientIdSelected) ? this.patientIdSelected : 0,
                office_id: (this.appointment.office_id) ? this.appointment.office_id : 0,
                allDay: 0

            };

            this.isWaiting = true;
            this.appointmentService.save(appointment)
                .then(data => {
                    console.log(data)

                    if (data.error) {
                        message = data.error.message;
                        styleClass = 'error';
                    }

                    let toast = this.toastCtrl.create({
                        message: message,
                        cssClass: 'mytoast ' + styleClass,
                        duration: 3000
                    });
                    toast.present(toast);

                    if (data.appointment)
                        this.appointment = data.appointment;

                    this.isWaiting = null;

                })
                .catch(error => {
                   
                    let message = 'Ha ocurrido un error guardando la cita';
                    
                    if (error._body && error.status == 422){
                        message = JSON.parse(error._body).message;
                    }

                    let toast = this.toastCtrl.create({
                        message: message,
                        cssClass: 'mytoast error',
                        duration: 3000
                    });

                    toast.present(toast);
                  
                    this.isWaiting = null;

                }
                );
        }
    }
    deleteAppointment(appointment) {
        if (this.networkService.noConnection()) {
            this.networkService.showNetworkAlert();
        } else {
            let loader = this.loadingCtrl.create({
                content: "Espere por favor...",

            });

            loader.present();
            this.appointmentService.delete(appointment.delete_id)
                .then(data => {
                    console.log(data)
                   
                    let dataAppointment = { date: appointment.start };

                    loader.dismiss();
                    this.dismiss(dataAppointment);


                })
                .catch(error => {
                    let message = 'Ha ocurrido un error eliminado la cita';
                   
                    if (error._body && error.status == 422) {
                        message = JSON.parse(error._body).message;
                    }

                    // if (error.status == 403)
                    //     message = 'No se puede eliminar la cita por que ya esta iniciada';

                    let toast = this.toastCtrl.create({
                        message: message,
                        cssClass: 'mytoast error',
                        duration: 3000
                    });
                    console.log(error);
                    toast.present(toast);
                    loader.dismiss();
                });
        }
    }
    goHome(){
        
        let data = { toHome: true };
        this.viewCtrl.dismiss(data);
        
    }
    parseDate(date) {
        return moment(date).format('YYYY-MM-DD h:mm A');
    }
    dismiss(dataDelete:any) {
       
        let data = { date: this.appointment.date };
       
         if(this.appointment.fromScheduledAppointments){

            if(dataDelete)
                this.viewCtrl.dismiss(dataDelete);
            else 
                this.viewCtrl.dismiss({date:''});  

         }else{
            if(dataDelete)
                this.viewCtrl.dismiss(dataDelete);
            else 
                this.viewCtrl.dismiss(data);   
          
         
        }
    }

}
