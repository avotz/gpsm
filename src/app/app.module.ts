import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, LOCALE_ID  } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule} from '@angular/http';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
//import {RlTagInputModule} from 'angular2-tag-input';
import { NgCalendarModule  } from 'ionic2-calendar';
import { Geolocation } from '@ionic-native/geolocation';
import { SocialSharing } from '@ionic-native/social-sharing';
import { File } from '@ionic-native/file';
//import { FileOpener } from '@ionic-native/file-opener';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { Network } from '@ionic-native/network';
import { Diagnostic } from '@ionic-native/diagnostic';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Ionic2RatingModule } from 'ionic2-rating';
//import { FCM } from '@ionic-native/fcm';
//import { ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs);
import { AppVersion } from '@ionic-native/app-version';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LandingPage } from '../pages/landing/landing';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { RegisterPatientPage } from '../pages/register-patient/register-patient';
import { SearchMedicPage } from '../pages/search-medic/search-medic';
import { SearchClinicPage } from '../pages/search-clinic/search-clinic';
import { MedicDetailPage } from '../pages/medic-detail/medic-detail';
import { ClinicDetailPage } from '../pages/clinic-detail/clinic-detail';
import { MedicCalendarPage } from '../pages/medic-calendar/medic-calendar';
import { ModalReservationPage } from '../pages/medic-calendar/modal-reservation';
import { AccountPage } from '../pages/account/account';
import { PatientsPage } from '../pages/patients/patients';
import { ModalPatientPage } from '../pages/patients/modal-patient';
import { ExpedientPage } from '../pages/expedient/expedient';
import { TabPersonalPage } from '../pages/expedient/tab-personal';
import { TabMedicoPage } from '../pages/expedient/tab-medico';
import { ModalAppointmentPage } from '../pages/expedient/modal-appointment';
import { ReviewPage } from '../pages/review/review';
import { AppointmentsPage } from '../pages/appointments/appointments';
import { PasswordResetPage } from '../pages/login/password-reset';
import { NewPasswordPage } from '../pages/login/new-password';

import { NetworkServiceProvider } from '../providers/network-service/network-service';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { PatientServiceProvider } from '../providers/patient-service/patient-service';
import { MedicServiceProvider } from '../providers/medic-service/medic-service';
import { AppointmentServiceProvider } from '../providers/appointment-service/appointment-service';
import { ClinicServiceProvider } from '../providers/clinic-service/clinic-service';
import { ReviewServiceProvider } from '../providers/review-service/review-service';
import { NotificationsPage } from '../pages/notifications/notifications';
import { ConfigNotificationsPage } from '../pages/config-notifications/config-notifications';
import { Badge } from '@ionic-native/badge';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LandingPage,
    LoginPage,
    RegisterPage,
    RegisterPatientPage,
    SearchMedicPage,
    SearchClinicPage,
    MedicDetailPage,
    ClinicDetailPage,
    MedicCalendarPage,
    ModalReservationPage,
    AccountPage,
    PatientsPage,
    ModalPatientPage,
    ExpedientPage,
    TabPersonalPage,
    TabMedicoPage,
    ModalAppointmentPage,
    ReviewPage,
    AppointmentsPage,
    PasswordResetPage,
    NewPasswordPage,
    NotificationsPage,
    ConfigNotificationsPage,
    
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
      
    }),
    HttpModule,
    NgCalendarModule,
    Ionic2RatingModule
    
    

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
    SearchClinicPage,
    MedicDetailPage,
    ClinicDetailPage,
    MedicCalendarPage,
    ModalReservationPage,
    AccountPage,
    PatientsPage,
    ModalPatientPage,
    ExpedientPage,
    TabPersonalPage,
    TabMedicoPage,
    ModalAppointmentPage,
    ReviewPage,
    AppointmentsPage,
    PasswordResetPage,
    NewPasswordPage,
    NotificationsPage,
    ConfigNotificationsPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    File,
    Transfer,
    Camera,
    Badge,
    PhotoViewer,
    FilePath,
    Facebook,
    GooglePlus,
    LaunchNavigator,
    Network,
    Diagnostic,
    InAppBrowser,
    NetworkServiceProvider,
    AuthServiceProvider,
    PatientServiceProvider,
    MedicServiceProvider,
    ClinicServiceProvider,
    AppointmentServiceProvider,
    ReviewServiceProvider,
    SocialSharing,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: LOCALE_ID, useValue: 'es-CR'},
    AppVersion
    
    
  ]
})
export class AppModule {}
