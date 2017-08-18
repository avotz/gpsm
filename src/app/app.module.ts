import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, LOCALE_ID  } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule} from '@angular/http';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import {RlTagInputModule} from 'angular2-tag-input';
import { NgCalendarModule  } from 'ionic2-calendar';
import { Geolocation } from '@ionic-native/geolocation';
//import { ReactiveFormsModule } from '@angular/forms';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LandingPage } from '../pages/landing/landing';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { RegisterPatientPage } from '../pages/register-patient/register-patient';
import { SearchMedicPage } from '../pages/search-medic/search-medic';
import { MedicDetailPage } from '../pages/medic-detail/medic-detail';
import { MedicCalendarPage } from '../pages/medic-calendar/medic-calendar';
import { ModalReservationPage } from '../pages/medic-calendar/modal-reservation';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { PatientServiceProvider } from '../providers/patient-service/patient-service';
import { MedicServiceProvider } from '../providers/medic-service/medic-service';
import { AppointmentServiceProvider } from '../providers/appointment-service/appointment-service';


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
    MedicCalendarPage,
    ModalReservationPage
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
    MedicCalendarPage,
    ModalReservationPage

  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: LOCALE_ID, useValue: 'es-CR'},
    Facebook,
    GooglePlus,
    AuthServiceProvider,
    PatientServiceProvider,
    MedicServiceProvider,
    AppointmentServiceProvider
  ]
})
export class AppModule {}
