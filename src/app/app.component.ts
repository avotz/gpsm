import { Component, ViewChild } from '@angular/core';
import { Nav, Platform  } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {Facebook} from '@ionic-native/facebook';
import {GooglePlus } from '@ionic-native/google-plus';

import { HomePage } from '../pages/home/home';
import { LandingPage } from '../pages/landing/landing';
import { SearchMedicPage } from '../pages/search-medic/search-medic';
import { SearchClinicPage } from '../pages/search-clinic/search-clinic';
import { AccountPage } from '../pages/account/account';
import { PatientsPage } from '../pages/patients/patients';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
   @ViewChild(Nav) nav: Nav;

  rootPage:any = LandingPage;

  pages: Array<{title: string, component: any}>

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private fb:Facebook, private gp:GooglePlus) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Inicio', component: HomePage },
      { title: 'Buscar Médico', component: SearchMedicPage },
      { title: 'Buscar Clínica', component: SearchClinicPage },
      { title: 'Mi Expediente', component: PatientsPage },
      { title: 'Pacientes', component: PatientsPage },
      { title: 'Cuenta', component: AccountPage }
    ];

    this.checkPreviousAuthorization(); 
  }

  checkPreviousAuthorization(): void { 
  
    if((window.localStorage.getItem('token') === "undefined" || window.localStorage.getItem('token') === null)) {
      this.rootPage = LandingPage;
    } else {
      this.rootPage = HomePage;
    }
    
  } 
  
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logout(): void {
   
	    window.localStorage.removeItem('auth_user');
	    window.localStorage.removeItem('token');
       
      if(window.localStorage.getItem('login_type') === 'google')
        this.googlePlus_logout();
      if(window.localStorage.getItem('login_type') === 'facebook')
        this.facebook_logout();
      
      
      window.localStorage.removeItem('login_type');

	    this.nav.setRoot(LandingPage);
	   
    }

    googlePlus_logout() {
     
      this.gp.logout().then(
          (success) => {
              console.log('GOOGLE+: logout DONE', success);
          },
          (failure) => {
              console.log('GOOGLE+: logout FAILED', failure);
          }
      );
  } 
  facebook_logout() {

    this.fb.logout().then(response => {
          console.log(response)
          console.log('Facebook: logout DONE');
        })
        .catch(error =>{
          console.error( error );
        });
     
      
  } 
}

