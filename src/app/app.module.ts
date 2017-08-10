import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule} from '@angular/http';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import {RlTagInputModule} from 'angular2-tag-input';
import { NgCalendarModule  } from 'ionic2-calendar';
import { Geolocation } from '@ionic-native/geolocation';


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LandingPage } from '../pages/landing/landing';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { RegisterPatientPage } from '../pages/register-patient/register-patient';
import { SearchMedicPage } from '../pages/search-medic/search-medic';
import { MedicDetailPage } from '../pages/medic-detail/medic-detail';
import { MedicCalendarPage } from '../pages/medic-calendar/medic-calendar';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { PatientServiceProvider } from '../providers/patient-service/patient-service';
import { MedicServiceProvider } from '../providers/medic-service/medic-service';



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LandingPage,
    LoginPage,
    RegisterPage,
    RegisterPatientPage,
    SearchMedicPage,
    MedicDetailPage,
    MedicCalendarPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    RlTagInputModule,
    NgCalendarModule

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LandingPage,
    LoginPage,
    RegisterPage,
    RegisterPatientPage,
    SearchMedicPage,
    MedicDetailPage,
    MedicCalendarPage

  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Facebook,
    GooglePlus,
    AuthServiceProvider,
    PatientServiceProvider,
    MedicServiceProvider
  ]
})
export class AppModule {}
