import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
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
  constructor(public navCtrl: NavController, public navParams: NavParams, public patientService: PatientServiceProvider, public loadingCtrl: LoadingController, public modalCtrl: ModalController) {

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
     .catch(error => alert(JSON.stringify(error)));
  }
  
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad PatientsPage');
  }

}
