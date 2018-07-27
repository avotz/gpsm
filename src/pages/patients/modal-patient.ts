import { Component } from '@angular/core';
import { Platform, NavParams, ViewController, ToastController, LoadingController, NavController } from 'ionic-angular';
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
    constructor(public platform: Platform, public navParams: NavParams, public navCtrl: NavController, public viewCtrl: ViewController, public toastCtrl: ToastController, public patientService: PatientServiceProvider, public loadingCtrl: LoadingController, public formBuilder: FormBuilder, public networkService: NetworkServiceProvider) {

        this.patient = this.navParams.data;


        this.authUser = JSON.parse(window.localStorage.getItem('auth_user'));

        this.errorSave = '';
        this.patientForm = formBuilder.group({
            first_name: [this.patient.first_name, Validators.required],
            last_name: [this.patient.last_name, Validators.required],
            birth_date: [this.patient.birth_date, Validators.required],
            gender: [this.patient.gender, Validators.required],
            phone_country_code: [this.patient.phone_country_code ? this.patient.phone_country_code : '+506', Validators.required],
            phone_number: [this.patient.phone_number, Validators.required],
            email: [this.patient.email],
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
                            this.isWaiting = null;


                            this.errorSave = errorSaveText + ' ' + errorSaveTextPhone
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
                            let message = 'Ha ocurrido un error registrando el paciente.';
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
                            this.isWaiting = null;


                            this.errorSave = errorSaveText + ' ' + errorSaveTextPhone
                            console.log(error);

                        });


                } //else if

            } //isvalid
        }


    }//savePatient

    goHome(){
       
        this.viewCtrl.dismiss({ toHome: true });
    }

    dismiss() {
        if (this.isSaved)
            this.viewCtrl.dismiss({ fromUser: true });
        else
            this.viewCtrl.dismiss({});

    }

}
