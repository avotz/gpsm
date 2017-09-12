import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {PatientServiceProvider} from '../../providers/patient-service/patient-service';
import { TabPersonalPage } from './tab-personal';
import { TabMedicoPage } from './tab-medico';
import { PatientsPage } from '../patients/patients';

@Component({
  selector: 'page-expedient',
  templateUrl: 'expedient.html',
})
export class ExpedientPage {
  
  patient: any;
  tabPersonal:any;
  tabMedico:any;
  personalTabParams:any;
  medicalTabParams:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public patientService: PatientServiceProvider) {
    
    this.patient = this.navParams.data;
    this.personalTabParams = this.patient;
    this.medicalTabParams = this.patient;
    
    this.tabPersonal = TabPersonalPage;
    this.tabMedico = TabMedicoPage;
   

  }
  
  goPatients(){
    this.navCtrl.push(PatientsPage);
}

  
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad expedientPage');
  }

}
