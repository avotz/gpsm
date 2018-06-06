import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientServiceProvider } from '../../providers/patient-service/patient-service';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-register-patient',
  templateUrl: 'register-patient.html',
})
export class RegisterPatientPage {
  patientForm: FormGroup;
  errorSave;
  submitAttempt: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public patientService: PatientServiceProvider, public loadingCtrl: LoadingController, public formBuilder: FormBuilder, public networkService: NetworkServiceProvider, public toastCtrl: ToastController) {

    this.navCtrl = navCtrl;
    this.patientService = patientService;
    this.errorSave = '';
    this.patientForm = formBuilder.group({
      first_name: [navParams.get('name'), Validators.required],
      last_name: ['', Validators.required],
      birth_date: ['', Validators.required],
      gender: ['', Validators.required],
      phone_country_code: [navParams.get('phone_country') ? navParams.get('phone_country') : '+506', Validators.required],
      phone_number: [navParams.get('phone'), Validators.required],
      email: [navParams.get('email')],
      address: [''],
      province: ['', Validators.required],
      city: [''],
      conditions: [''],

    });


  }

  savePatient() {

    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else {
      this.submitAttempt = true;

      if (this.patientForm.valid) {


        let loader = this.loadingCtrl.create({
          content: "Espere por favor...",
          //duration: 3000
        });

        loader.present();

        this.patientService.register(this.patientForm.value)
          .then(data => {

            loader.dismiss();
            console.log(data);
            if (data.error) {
              this.errorSave = data.error;
              return;
            }



            this.errorSave = "";

            this.navCtrl.setRoot(HomePage);


          })
          .catch(error => {
            let message = 'Ha ocurrido un error actualizando el paciente.';
            let errorSaveText = error.statusText;
            let errorSaveTextPhone = error.statusText;

            if (error.status == 422) {
              errorSaveText = "";
              errorSaveTextPhone = "";
              let body = JSON.parse(error._body)

              if (body.errors.email)
                errorSaveText = body.errors.email[0]
              if (body.errors.phone_number)
                errorSaveTextPhone = body.errors.phone_number[0]

              message = message + errorSaveText + ' ' + errorSaveTextPhone

            }

            let toast = this.toastCtrl.create({
              message: message,
              cssClass: 'mytoast error',
              duration: 4500
            });

            toast.present(toast);


            this.errorSave = errorSaveText + ' ' + errorSaveTextPhone
            console.log(error);
            loader.dismiss();
          });
      }

    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPatientPage');
  }

}
