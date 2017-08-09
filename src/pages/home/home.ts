import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { LandingPage } from '../landing/landing';
import { SearchMedicPage } from '../search-medic/search-medic';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  auth;
  constructor(public navCtrl: NavController) {
   
    this.auth = JSON.parse(window.localStorage.getItem('auth_user'));
   
  }

  searchMedic () {

    this.navCtrl.push(SearchMedicPage)
    //this.navCtrl.setRoot(SearchMedicPage);

  }

  

}
