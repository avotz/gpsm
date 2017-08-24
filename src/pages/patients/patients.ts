import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController, ToastController, ActionSheetController } from 'ionic-angular';
import {PatientServiceProvider} from '../../providers/patient-service/patient-service';
import { ModalPatientPage } from './modal-patient';
import { ExpedientPage } from '../expedient/expedient';
import {SERVER_URL} from '../../providers/config';

@Component({
  selector: 'page-patients',
  templateUrl: 'patients.html',
})
export class PatientsPage {

  serverUrl: String = SERVER_URL;
  patients:any = [];
  authUser: any;
  submitAttempt: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public patientService: PatientServiceProvider, public loadingCtrl: LoadingController, public modalCtrl: ModalController, public toastCtrl: ToastController, public actionSheetCtrl: ActionSheetController) {

       this.navCtrl = navCtrl;
       this.authUser = JSON.parse(window.localStorage.getItem('auth_user'));
      
       this.getPatientsFromUser();

  }

  newPatient(){

    let modal = this.modalCtrl.create(ModalPatientPage);
    modal.onDidDismiss(data => {
      
      if(data)
        this.getPatientsFromUser();

    });
    modal.present();

  }
  openExpedient(patient){
    
    this.navCtrl.push(ExpedientPage, patient);
  }

  openPatientDetail(patient){

    let modal = this.modalCtrl.create(ModalPatientPage, patient);
    modal.onDidDismiss(data => {
      
      if(data)
        this.getPatientsFromUser();

    });
    modal.present();
  }
  deletePatient(patient){
    let loader = this.loadingCtrl.create({
      content: "Espere por favor...",
      
    });

    loader.present();
    this.patientService.delete(patient.id)
    .then(data => {
       console.log(data)
       let index = this.patients.indexOf(patient)
       this.patients.splice(index, 1);
     
           
       loader.dismiss();
        
         
     })
     .catch(error => {
        let message =  'Ha ocurrido un error eliminado el paciente';

        if(error.status == 403)
          message =  'No se puede eliminar paciente por que tiene citas iniciadas';

              let toast = this.toastCtrl.create({
                  message: message,
                  cssClass: 'mytoast error',
                  duration: 3000
              });
      
              toast.present(toast);
        loader.dismiss();
     });
  }
  getPatientsFromUser(){
    let loader = this.loadingCtrl.create({
      content: "Espere por favor...",
      
    });

    loader.present();
    this.patientService.findAllByUser(this.authUser.id)
    .then(data => {
       console.log(data)
       this.patients = data;
       loader.dismiss();
        
         
     })
     .catch(error => {
        let message =  'Ha ocurrido un error en consultado tus pacientes ';
      
              let toast = this.toastCtrl.create({
                  message: message,
                  cssClass: 'mytoast error',
                  duration: 3000
              });
      
              toast.present(toast);
        loader.dismiss();
     });
  }
  presentOptions(patient) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Opciones',
      buttons: [
        {
          text: 'Editar',
          handler: () => {
            this.openPatientDetail(patient)
          }
        },{
          text: 'Ver Expediente',
          handler: () => {
            this.openExpedient(patient)
          }
        },{
          text: 'Eliminar',
          handler: () => {
            this.deletePatient(patient)
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
  
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad PatientsPage');
  }

}
