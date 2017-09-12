import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { PatientServiceProvider } from '../../providers/patient-service/patient-service';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
import { SearchMedicPage } from '../search-medic/search-medic';
import { SearchClinicPage } from '../search-clinic/search-clinic';
//import { PatientsPage } from '../patients/patients';
import { ExpedientPage } from '../expedient/expedient';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  auth;
  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public networkService: NetworkServiceProvider,public loadingCtrl: LoadingController, public patientService: PatientServiceProvider) {

    this.auth = JSON.parse(window.localStorage.getItem('auth_user'));


  }
  expedient() {
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else {
      let loader = this.loadingCtrl.create({
        content: "Espere por favor...",

      });

      loader.present();
      this.patientService.firstByUser(this.auth.id)
        .then(data => {
          console.log(data)
          loader.dismiss();
          this.navCtrl.push(ExpedientPage, data)

        })
        .catch(error => {
          let message = 'Ha ocurrido un error en consultado tus pacientes. ¿tienes pacientes registrados? ';
         
          let toast = this.toastCtrl.create({
            message: message,
            cssClass: 'mytoast error',
            duration: 3000
          });

          toast.present(toast);
          loader.dismiss();
        });
    }
    
    //this.navCtrl.setRoot(SearchMedicPage);

  }

  searchMedic() {

    this.navCtrl.push(SearchMedicPage)
    //this.navCtrl.setRoot(SearchMedicPage);

  }

  searchClinic() {

    this.navCtrl.push(SearchClinicPage)
    //this.navCtrl.setRoot(SearchMedicPage);

  }



}
