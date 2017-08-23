import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import {PatientServiceProvider} from '../../providers/patient-service/patient-service';
import moment from 'moment'


@Component({
  selector: 'tab-medico',
  templateUrl: 'tab-medico.html',
})
export class TabMedicoPage {
  shownGroup = null;
  patient: any;
  isWaiting: boolean = null;
  appointments: any = [];
  history: any = [];
  allergies:  any = [];
  pathologicals: any = [];
  no_pathologicals: any = [];
  heredos: any = [];
  ginecos: any = [];
  medical_control: string = "history";
  constructor(public navCtrl: NavController, public navParams: NavParams, public patientService: PatientServiceProvider, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
    
    this.patient = this.navParams.data;
    
    this.getHistories()

  }
  getHistories(){
    let loader = this.loadingCtrl.create({
      content: "Espere por favor...",
      
      });
  
    loader.present();
    this.patientService.getHistory(this.patient.id)
    .then(data => {
        
        this.appointments = data.appointments;
        this.history = data.history;
        this.allergies = this.history.allergies;
        this.pathologicals = this.history.pathologicals;
        this.no_pathologicals = this.history.nopathologicals;
        this.heredos = this.history.heredos;
        this.ginecos = this.history.ginecos;
        loader.dismissAll();
    })
    .catch(error => {
    
        console.log(error);
        loader.dismissAll();
        
    });
  }
  timeFormat(date){
    return moment(date).format('h:mm A');
  }
  dateFormat(date){
    return moment(date).format('YYYY-MM-DD');
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
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad tabMedicoPage');
  }

}
