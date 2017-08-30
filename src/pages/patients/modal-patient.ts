import { Component } from '@angular/core';
import { Platform, NavParams, ViewController, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientServiceProvider } from '../../providers/patient-service/patient-service';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';

@Component({
    selector: 'modal-patient',
    templateUrl: 'modal-patient.html',
})
export class ModalPatientPage {

    patientForm: FormGroup;
    authUser: any;
    isWaiting: boolean = null;
    patient: any;
    errorSave;
    submitAttempt: boolean = false;
    isSaved: boolean = false;
    constructor(public platform: Platform, public navParams: NavParams, public viewCtrl: ViewController, public toastCtrl: ToastController, public patientService: PatientServiceProvider, public loadingCtrl: LoadingController, public formBuilder: FormBuilder, public networkService: NetworkServiceProvider) {

        this.patient = this.navParams.data;


        this.authUser = JSON.parse(window.localStorage.getItem('auth_user'));

        this.errorSave = '';
        this.patientForm = formBuilder.group({
            first_name: [this.patient.first_name, Validators.required],
            last_name: [this.patient.last_name, Validators.required],
            birth_date: [this.patient.birth_date, Validators.required],
            gender: [this.patient.gender, Validators.required],
            phone: [this.patient.phone, Validators.required],
            email: [this.patient.email, Validators.required],
            address: [this.patient.address],
            province: [this.patient.province, Validators.required],
            city: [this.patient.city],
            conditions: [this.patient.conditions],

        });



    }

    savePatient() {
        if (this.networkService.noConnection()) {
            this.networkService.showNetworkAlert();
        } else {
            this.submitAttempt = true;
            let message = 'Paciente Creado Correctamente';
            let styleClass = 'success';


            if (this.patientForm.valid) {


                this.isWaiting = true;

                if (this.patient.id) {

                    message = 'Paciente Actualizado Correctamente';

                    this.patientService.update(this.patient.id, this.patientForm.value)
                        .then(data => {

                            if (data.error) {
                                message = data.error.message;
                                styleClass = 'error';
                            }

                            let toast = this.toastCtrl.create({
                                message: message,
                                cssClass: 'mytoast ' + styleClass,
                                duration: 3000
                            });
                            toast.present(toast);

                            this.isWaiting = null;
                            this.isSaved = true;
                            this.dismiss();
                            //this.navCtrl.push(HomePage);    


                        })
                        .catch(error => {

                            this.errorSave = error.statusText;
                            console.log(error);

                        });

                } else {

                    this.patientService.register(this.patientForm.value)
                        .then(data => {

                            if (data.error) {
                                message = data.error.message;
                                styleClass = 'error';
                            }

                            let toast = this.toastCtrl.create({
                                message: message,
                                cssClass: 'mytoast ' + styleClass,
                                duration: 3000
                            });
                            toast.present(toast);

                            this.isWaiting = null;
                            this.isSaved = true;
                            this.dismiss();
                            //this.navCtrl.push(HomePage);    


                        })
                        .catch(error => {

                            this.errorSave = error.statusText;
                            console.log(error);

                        });


                } //else if

            } //isvalid
        }


    }//savePatient



    dismiss() {
        if (this.isSaved)
            this.viewCtrl.dismiss({ data: true });
        else
            this.viewCtrl.dismiss();

    }

}
