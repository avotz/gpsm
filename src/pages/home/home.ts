import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { SearchMedicPage } from '../search-medic/search-medic';
import { SearchClinicPage } from '../search-clinic/search-clinic';
import { PatientsPage } from '../patients/patients';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  auth;
  constructor(public navCtrl: NavController) {
   
    this.auth = JSON.parse(window.localStorage.getItem('auth_user'));
   
  }
  expedient () {
    
        this.navCtrl.push(PatientsPage)
        //this.navCtrl.setRoot(SearchMedicPage);
    
      }
    
  searchMedic () {

    this.navCtrl.push(SearchMedicPage)
    //this.navCtrl.setRoot(SearchMedicPage);

  }

  searchClinic () {
    
        this.navCtrl.push(SearchClinicPage)
        //this.navCtrl.setRoot(SearchMedicPage);
    
      }

  

}
