import { Component } from '@angular/core';
import { Platform, ActionSheetController, ActionSheet,  NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {SERVER_URL} from '../../providers/config';
import {PatientServiceProvider} from '../../providers/patient-service/patient-service';



@Component({
  selector: 'page-expedient',
  templateUrl: 'expedient.html',
})
export class ExpedientPage {
  pressureForm: FormGroup;
  serverUrl: String = SERVER_URL;
  patient: any;
  errorSave:any;
  isWaiting: boolean = null;
  submitAttempt: boolean = false;
  pressures: any = [];
  constructor(public platform: Platform, public actionSheetCtrl: ActionSheetController, public navCtrl: NavController, public navParams: NavParams,public formBuilder: FormBuilder, public patientService: PatientServiceProvider, public toastCtrl: ToastController) {
    
    this.patient = this.navParams.data;
    this.isWaiting = true;
    this.pressureForm = formBuilder.group({
        date_control: ['',Validators.required],
        time_control: ['',Validators.required],
        pd: ['',Validators.required],
        ps: ['',Validators.required],
       
      });
      
    this.getPressures();

  }
  getPressures(){
    this.patientService.getPressures(this.patient.id)
    .then(data => {
        
        this.pressures = data;
    

    })
    .catch(error => {
    
        this.errorSave = error.statusText;
        console.log(error);
        
    });
  }
  savePressure(){
      console.log(this.pressureForm.value);
      this.submitAttempt = true;
      let message ='Control guardado Correctamente';
      let styleClass ='success';
     
   
      if(this.pressureForm.valid){
            this.isWaiting = true;

            this.patientService.savePressure(this.patient.id, this.pressureForm.value)
            .then(data => {
                
                if(data.error)
                {
                    message =  data.error.message;
                    styleClass = 'error';
                }
                
                let toast = this.toastCtrl.create({
                    message: message,
                    cssClass: 'mytoast '+ styleClass,
                    duration: 3000
                });
                toast.present(toast);
                this.pressures.push(data);
                this.isWaiting = null;
                this.submitAttempt = false;
                this.clearForm(this.pressureForm)
                
              
            

            })
            .catch(error => {
            
                this.errorSave = error.statusText;
                console.log(error);
                
            });
    }
  }
  deletePressure(pressure){
    let message ='Control eliminado Correctamente';
    let styleClass ='success';
   
    this.patientService.deletePressure(pressure.id)
    .then(resp => {
        
        let toast = this.toastCtrl.create({
            message: message,
            cssClass: 'mytoast '+ styleClass,
            duration: 3000
        });
        toast.present(toast);
        
        let index = this.pressures.indexOf(pressure)
        this.pressures.splice(index, 1);
        this.isWaiting = null;
            
     
    })
    .catch(error => {

        message =  'Error al eliminar el control';

        let toast = this.toastCtrl.create({
            message: message,
            cssClass: 'mytoast error',
            duration: 3000
        });

        toast.present(toast);
        
    });
  }
  clearForm(form){
    
     form.get('date_control').setValue('')
     form.get('time_control').setValue('')
     form.get('pd').setValue('')
     form.get('ps').setValue('')
     
   
   }

  ionViewDidLoad() {
    console.log('ionViewDidLoad expedientPage');
  }

}
