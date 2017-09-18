import { Component } from '@angular/core';
import { NavController, NavParams, Platform, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { PatientServiceProvider } from '../../providers/patient-service/patient-service';
//import { File } from '@ionic-native/file';
//import { Transfer, TransferObject } from '@ionic-native/transfer';
//import { FilePath } from '@ionic-native/file-path';
import moment from 'moment'
import { SERVER_URL } from '../../providers/config';
import { ModalAppointmentPage } from './modal-appointment';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';

@Component({
  selector: 'tab-medico',
  templateUrl: 'tab-medico.html',
})
export class TabMedicoPage {
  serverUrl: String = SERVER_URL;
  shownGroup = null;
  patient: any;
  isWaiting: boolean = null;
  appointments: any = [];
  history: any = [];
  allergies: any = [];
  pathologicals: any = [];
  no_pathologicals: any = [];
  heredos: any = [];
  ginecos: any = [];
  labexams: any = [];
  medical_control: string = "history";
  storageDirectory: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public patientService: PatientServiceProvider, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public modalCtrl: ModalController, public networkService: NetworkServiceProvider, public platform: Platform) {

    this.patient = this.navParams.data;

    // if (this.platform.is('ios')) {
    //   this.storageDirectory = this.file.cacheDirectory; //cordova.file.documentsDirectory;
    // }
    // else{ //android
    //   this.storageDirectory = this.file.cacheDirectory; //cordova.file.dataDirectory;
    // }

    this.getHistories()

  }
  getHistories(refresher:any = null) {
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else {
      let loader = this.loadingCtrl.create({
        content: "Espere por favor...",

      });
     

      loader.present();
      this.patientService.getHistory(this.patient.id)
        .then(data => {

          this.appointments = data.appointments;
          //this.labexams = data.labexams;
          this.history = data.history;
          this.allergies = this.history.allergies;
          this.pathologicals = this.history.pathologicals;
          this.no_pathologicals = this.history.nopathologicals;
          this.heredos = this.history.heredos;
          this.ginecos = this.history.ginecos;
          loader.dismissAll();
          
          if(refresher)
            refresher.complete()

        })
        .catch(error => {

          console.log(error);
          loader.dismissAll();

          if(refresher)
            refresher.complete()

        });
    }
  }
  timeFormat(date) {
    return moment(date).format('h:mm A');
  }
  dateFormat(date) {
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

  openAppointmentDetail(appointment) {
    let modal = this.modalCtrl.create(ModalAppointmentPage, appointment);
    modal.onDidDismiss(data => {


    });
    modal.present();
  }

  // download(item) {
  //   const fileTransfer: TransferObject = this.transfer.create();
    
  //   var url = encodeURI(`${this.serverUrl}/storage/patients/${this.patient.id }/labresults/${item.id}/${item.name}`);
  //   var fileName = item.name;
  //   //window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess, fileSystemFail);
  //   fileTransfer.download(url, this.storageDirectory  + 'gpsmedica/'+ fileName).then((entry) => {
  //     console.log('download complete: ' + entry.toURL());
  //     /*this.fileOpener.open(this.file.cacheDirectory  + 'gpsmedica/'+ fileName, 'image')
  //     .then(() => console.log('File is opened'))
  //     .catch(e => console.log('Error openening file', e));*/
  //     //alert("File downloaded to "+this.file.cacheDirectory + 'gpsmedica/');
  //     const alertSuccess = this.alertCtrl.create({
  //       title: `Download Succeeded!`,
  //       subTitle: `${fileName} was successfully downloaded to: ${entry.toURL()}`,
  //       buttons: ['Ok']
  //     });

  //     alertSuccess.present();
  //   }, (error) => {
  //     console.log(error)
  //   });
      
  // }
  doRefresh(refresher:any){
    console.log(refresher)
    this.getHistories(refresher)

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad tabMedicoPage');
  }

}
