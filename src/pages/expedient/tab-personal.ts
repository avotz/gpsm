import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientServiceProvider } from '../../providers/patient-service/patient-service';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';

import moment from 'moment'


@Component({
    selector: 'tab-personal',
    templateUrl: 'tab-personal.html',
})
export class TabPersonalPage {
    pressureForm: FormGroup;
    sugarForm: FormGroup;
    medicineForm: FormGroup;
    allergyForm: FormGroup;
    patient: any;
    errorSave: any;
    isWaiting: boolean = null;
    submitAttempt: boolean = false;
    pressures: any = [];
    sugars: any = [];
    medicines: any = [];
    allergies: any = [];
    personal_control: string = "pressure";
    loader: any;
    medic_id: any;
    authUser: any;
    // optionsGlicemia: any = [];
    // optionsPD: any = [];
    // optionsPS: any = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public patientService: PatientServiceProvider, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public networkService: NetworkServiceProvider) {

        this.authUser = JSON.parse(window.localStorage.getItem('auth_user'));
        this.patient = this.navParams.data;
        this.medic_id = this.authUser.id;
        
        // for (var i = 40; i <= 150; i++) {
        //     this.optionsPD.push(i);
        // }
        // for (var i = 60; i <= 250; i++) {
        //     this.optionsPS.push(i);
        // }

        this.pressureForm = formBuilder.group({
            date_control: [moment(new Date()).format("YYYY-MM-DD"), Validators.required],
            time_control: [moment(new Date()).format("HH:MM"), Validators.required],
            pd: ['', Validators.compose([Validators.pattern('[0-9.]*'), Validators.required])],
            ps: ['', Validators.compose([Validators.pattern('[0-9.]*'), Validators.required])],

        });
        this.sugarForm = formBuilder.group({
            date_control: [moment(new Date()).format("YYYY-MM-DD"), Validators.required],
            time_control: [moment(new Date()).format("HH:MM"), Validators.required],
            glicemia: ['', Validators.compose([Validators.pattern('[0-9.]*'), Validators.required])],


        });
        this.medicineForm = formBuilder.group({

            name: ['', Validators.required]


        });
        this.allergyForm = formBuilder.group({

            name: ['', Validators.required]


        });
        if (this.networkService.noConnection()) {
            this.networkService.showNetworkAlert();
        } else {
            this.loader = this.loadingCtrl.create({
                content: "Espere por favor...",

            });

            this.loader.present();


            this.getPressures();
            this.getSugars();
            this.getMedicines();
            this.getAllergies();
        }

    }
    getAllergies() {
        this.patientService.getAllergies(this.patient.id)
            .then(data => {

                this.allergies = data;
                this.loader.dismissAll();

            })
            .catch(error => {

                console.log(error);
                this.loader.dismissAll();

            });
    }
    getMedicines() {
        this.patientService.getMedicines(this.patient.id)
            .then(data => {

                this.medicines = data;


            })
            .catch(error => {

                console.log(error);

            });
    }
    getSugars() {
        this.patientService.getSugars(this.patient.id)
            .then(data => {

                this.sugars = data;


            })
            .catch(error => {

                console.log(error);

            });
    }
    getPressures() {
        this.patientService.getPressures(this.patient.id)
            .then(data => {

                this.pressures = data;


            })
            .catch(error => {

                console.log(error);

            });
    }
    saveAllergy() {
        if (this.networkService.noConnection()) {
            this.networkService.showNetworkAlert();
        } else {
            console.log(this.allergyForm.value);
            this.submitAttempt = true;
            let message = 'Alergia guardada Correctamente';
            let styleClass = 'success';


            if (this.allergyForm.valid) {
                this.isWaiting = true;

                this.patientService.saveAllergy(this.patient.id, this.allergyForm.value)
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
                        this.allergies.unshift(data);
                        this.isWaiting = null;
                        this.submitAttempt = false;
                        this.allergyForm.reset();




                    })
                    .catch(error => {

                        this.errorSave = error.statusText;
                        console.log(error);
                        this.isWaiting = null;
                    });
            }
        }
    }
    deleteAllergy(allergy) {
        if (this.networkService.noConnection()) {
            this.networkService.showNetworkAlert();
        } else {
            let message = 'Alergia eliminada Correctamente';
            let styleClass = 'success';
            this.isWaiting = true;
            this.patientService.deleteAllergy(allergy.id)
                .then(resp => {

                    let toast = this.toastCtrl.create({
                        message: message,
                        cssClass: 'mytoast ' + styleClass,
                        duration: 3000
                    });
                    toast.present(toast);

                    let index = this.allergies.indexOf(allergy)
                    this.allergies.splice(index, 1);
                    this.isWaiting = null;


                })
                .catch(error => {

                    message = 'Error al eliminar el control';

                    let toast = this.toastCtrl.create({
                        message: message,
                        cssClass: 'mytoast error',
                        duration: 3000
                    });

                    toast.present(toast);
                    this.isWaiting = null;

                });
        }
    }
    saveMedicine() {
        if (this.networkService.noConnection()) {
            this.networkService.showNetworkAlert();
        } else {
            console.log(this.medicineForm.value);
            this.submitAttempt = true;
            let message = 'Control guardado Correctamente';
            let styleClass = 'success';


            if (this.medicineForm.valid) {
                this.isWaiting = true;

                this.patientService.saveMedicine(this.patient.id, this.medicineForm.value)
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
                        this.medicines.unshift(data);
                        this.isWaiting = null;
                        this.submitAttempt = false;
                        this.medicineForm.reset();//.get('name').setValue('')




                    })
                    .catch(error => {

                        this.errorSave = error.statusText;
                        console.log(error);
                        this.isWaiting = null;
                    });
            }
        }
    }
    deleteMedicine(medicine) {
        if (this.networkService.noConnection()) {
            this.networkService.showNetworkAlert();
        } else {
            let message = 'Medicamento eliminado Correctamente';
            let styleClass = 'success';
            this.isWaiting = true;
            this.patientService.deleteMedicine(medicine.id)
                .then(resp => {

                    let toast = this.toastCtrl.create({
                        message: message,
                        cssClass: 'mytoast ' + styleClass,
                        duration: 3000
                    });
                    toast.present(toast);

                    let index = this.medicines.indexOf(medicine)
                    this.medicines.splice(index, 1);
                    this.isWaiting = null;


                })
                .catch(error => {

                    message = 'Error al eliminar el control';

                    let toast = this.toastCtrl.create({
                        message: message,
                        cssClass: 'mytoast error',
                        duration: 3000
                    });

                    toast.present(toast);
                    this.isWaiting = null;
                });
        }
    }
    saveSugar() {
        if (this.networkService.noConnection()) {
            this.networkService.showNetworkAlert();
        } else {
            console.log(this.sugarForm.value);
            this.submitAttempt = true;
            let message = 'Control guardado Correctamente';
            let styleClass = 'success';


            if (this.sugarForm.valid) {
                this.isWaiting = true;

                this.patientService.saveSugar(this.patient.id, this.sugarForm.value)
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
                        this.sugars.unshift(data);
                        this.isWaiting = null;
                        this.submitAttempt = false;
                        this.sugarForm.reset();
                        this.clearSugar(this.sugarForm)



                    })
                    .catch(error => {

                        this.errorSave = error.statusText;
                        console.log(error);
                        this.isWaiting = null;
                    });
            }
        }
    }
    deleteSugar(sugar) {
        if (this.networkService.noConnection()) {
            this.networkService.showNetworkAlert();
        } else {
            let message = 'Control eliminado Correctamente';
            let styleClass = 'success';
            this.isWaiting = true;
            this.patientService.deleteSugar(sugar.id)
                .then(resp => {

                    let toast = this.toastCtrl.create({
                        message: message,
                        cssClass: 'mytoast ' + styleClass,
                        duration: 3000
                    });
                    toast.present(toast);

                    let index = this.sugars.indexOf(sugar)
                    this.sugars.splice(index, 1);
                    this.isWaiting = null;


                })
                .catch(error => {

                    message = 'Error al eliminar el control';

                    let toast = this.toastCtrl.create({
                        message: message,
                        cssClass: 'mytoast error',
                        duration: 3000
                    });

                    toast.present(toast);
                    this.isWaiting = null;
                });
        }
    }
    savePressure() {
        if (this.networkService.noConnection()) {
            this.networkService.showNetworkAlert();
        } else {
            console.log(this.pressureForm.value);
            this.submitAttempt = true;
            let message = 'Control guardado Correctamente';
            let styleClass = 'success';


            if (this.pressureForm.valid) {
                this.isWaiting = true;

                this.patientService.savePressure(this.patient.id, this.pressureForm.value)
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
                        this.pressures.unshift(data);
                        this.isWaiting = null;
                        this.submitAttempt = false;
                        this.pressureForm.reset();
                        this.clearPressure(this.pressureForm)



                    })
                    .catch(error => {

                        this.errorSave = error.statusText;
                        console.log(error);
                        this.isWaiting = null;

                    });
            }
        }
    }
    deletePressure(pressure) {
        if (this.networkService.noConnection()) {
            this.networkService.showNetworkAlert();
        } else {
            let message = 'Control eliminado Correctamente';
            let styleClass = 'success';
            this.isWaiting = true;
            this.patientService.deletePressure(pressure.id)
                .then(resp => {

                    let toast = this.toastCtrl.create({
                        message: message,
                        cssClass: 'mytoast ' + styleClass,
                        duration: 3000
                    });
                    toast.present(toast);

                    let index = this.pressures.indexOf(pressure)
                    this.pressures.splice(index, 1);
                    this.isWaiting = null;


                })
                .catch(error => {

                    message = 'Error al eliminar el control';

                    let toast = this.toastCtrl.create({
                        message: message,
                        cssClass: 'mytoast error',
                        duration: 3000
                    });

                    toast.present(toast);
                    this.isWaiting = null;

                });
        }
    }
    clearPressure(form) {
       
        form.get('date_control').setValue(moment(new Date()).format("YYYY-MM-DD"))
        form.get('time_control').setValue(moment(new Date()).format("HH:MM"))
       // form.get('pd').setValue('')
       // form.get('ps').setValue('')



    }
    clearSugar(form) {

        form.get('date_control').setValue(moment(new Date()).format("YYYY-MM-DD"))
        form.get('time_control').setValue(moment(new Date()).format("HH:MM"))
        //form.get('glicemia').setValue('')


    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad expedientPage');
    }

}
