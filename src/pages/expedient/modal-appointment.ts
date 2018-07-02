import { Component } from '@angular/core';
import { Platform, NavParams, ViewController, ToastController, LoadingController } from 'ionic-angular';
import { PatientServiceProvider } from '../../providers/patient-service/patient-service';
import { AppointmentServiceProvider } from '../../providers/appointment-service/appointment-service';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { SERVER_URL } from '../../providers/config';
import moment from 'moment'
import { InAppBrowser } from '@ionic-native/in-app-browser';
@Component({
  selector: 'modal-appointment',
  templateUrl: 'modal-appointment.html',
})
export class ModalAppointmentPage {
  serverUrl: String = SERVER_URL;
  shownGroup = null;
  appointment: any;
  authUser: any;
  isWaiting: boolean = null;
  vitalSigns: any;
  disease_notes: string = "reason";
  diagnostics_treatments: string = "diagnostics";
  labexams: any = [];
  labresults: any = [];
  storageDirectory: string;
  constructor(public platform: Platform, public navParams: NavParams, public viewCtrl: ViewController, public toastCtrl: ToastController, public patientService: PatientServiceProvider, public appointmentService: AppointmentServiceProvider, public loadingCtrl: LoadingController, public networkService: NetworkServiceProvider, private photoViewer: PhotoViewer, public iab: InAppBrowser) {

    this.appointment = this.navParams.data;


    this.authUser = JSON.parse(window.localStorage.getItem('auth_user'));

    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else {
      let loader = this.loadingCtrl.create({
        content: "Espere por favor...",

      });

      loader.present();
      this.appointmentService.findById(this.appointment.id)
        .then(resp => {
          this.appointment = resp.appointment;
          this.vitalSigns = resp.vitalSigns;
          this.labexams = resp.labexams;
          this.labresults = resp.labresults;
          this.isWaiting = null;
          loader.dismissAll();
        })
        .catch(error =>{

          let message = 'Ha ocurrido un error actualizado la cuenta';

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

  parseDate(date) {
    return moment(date).format('YYYY-MM-DD HH:mm');
  }
  timeFormat(date) {
    return moment(date).format('h:mm A');
  }
  dateFormat(date) {
    return moment(date).format('YYYY-MM-DD');
  }
  // download(item) {
  //   const fileTransfer: TransferObject = this.transfer.create();
    
  //   var url = encodeURI(`${this.serverUrl}/storage/patients/${this.appointment.patient.id }/labresults/${item.id}/${item.name}`);
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
  showImage(result){
    let url = result.file_path;//`${this.serverUrl}/storage/patients/${this.appointment.patient.id }/labresults/${result.id}/${result.name}`

  
    let ext =  result.name.split('.').pop();

    if (ext == 'pdf' || ext == 'docx' || ext == 'xlsx' || ext == 'doc' || ext == 'xls')
      this.iab.create(url,'_system')
    else 
      this.photoViewer.show(url,'_blank');
    
  }
  dismiss() {

    this.viewCtrl.dismiss();

  }

}
