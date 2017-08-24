import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {PatientServiceProvider} from '../../providers/patient-service/patient-service';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-register-patient',
  templateUrl: 'register-patient.html',
})
export class RegisterPatientPage {
  patientForm: FormGroup;
  errorSave;
  submitAttempt: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public patientService: PatientServiceProvider, public loadingCtrl: LoadingController, public formBuilder: FormBuilder) {

       this.navCtrl = navCtrl;
       this.patientService = patientService;
       this.errorSave = '';
       this.patientForm = formBuilder.group({
        first_name: [navParams.get('name'),Validators.required],
        last_name: ['',Validators.required],
        birth_date: ['',Validators.required],
        gender: ['',Validators.required],
        phone: ['',Validators.required],
        email: [navParams.get('email'),Validators.required],
        address: [''],
        province: ['',Validators.required],
        city: [''],
        conditions: [''],
       
      });


  }
  
  savePatient(){

  	 this.submitAttempt = true;
 
    if(this.patientForm.valid){
      
 
     let loader = this.loadingCtrl.create({
        content: "Espere por favor...",
        //duration: 3000
      });

    loader.present();
   
     this.patientService.register(this.patientForm.value)
            .then(data => {
                
               loader.dismiss();
               console.log(data);
               if(data.error)
              {
                this.errorSave = data.error;
                return;
              }
      
    

              this.errorSave = "";
             
              this.navCtrl.setRoot(HomePage);    
            

            })
            .catch(error => {
             
              this.errorSave = error.statusText;
              console.log(error);
               loader.dismiss();
            });
      }


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPatientPage');
  }

}
