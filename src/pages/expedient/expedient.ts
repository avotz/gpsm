import { Component } from '@angular/core';
import { Platform, ActionSheetController, ActionSheet,  NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {SERVER_URL} from '../../providers/config';
import {PatientServiceProvider} from '../../providers/patient-service/patient-service';
import moment from 'moment'
import { TabPersonalPage } from './tab-personal';
import { TabMedicoPage } from './tab-medico';

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
  constructor(public platform: Platform, public actionSheetCtrl: ActionSheetController, public navCtrl: NavController, public navParams: NavParams,public formBuilder: FormBuilder, public patientService: PatientServiceProvider, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
    
    this.patient = this.navParams.data;
    this.personalTabParams = this.patient;
    this.medicalTabParams = this.patient;
    
    this.tabPersonal = TabPersonalPage;
    this.tabMedico = TabMedicoPage;
   

  }
  
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad expedientPage');
  }

}
