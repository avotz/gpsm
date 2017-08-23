import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {PatientServiceProvider} from '../../providers/patient-service/patient-service';
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
  errorSave:any;
  isWaiting: boolean = null;
  submitAttempt: boolean = false;
  pressures: any = [];
  sugars: any = [];
  medicines: any = [];
  allergies: any = [];
  personal_control: string = "pressure";
  loader:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public formBuilder: FormBuilder, public patientService: PatientServiceProvider, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
    
    this.patient = this.navParams.data;
    this.pressureForm = formBuilder.group({
        date_control: [moment(new Date()).format("YYYY-MM-DD"),Validators.required],
        time_control: [moment(new Date()).format("HH:MM"),Validators.required],
        pd: ['',Validators.compose([Validators.pattern('[0-9.]*'), Validators.required])],
        ps: ['',Validators.compose([Validators.pattern('[0-9.]*'), Validators.required])],
       
      });
    this.sugarForm = formBuilder.group({
        date_control: [moment(new Date()).format("YYYY-MM-DD"),Validators.required],
        time_control: [moment(new Date()).format("HH:MM"),Validators.required],
        glicemia: ['',Validators.compose([Validators.pattern('[0-9.]*'), Validators.required])],
       
       
      });
      this.medicineForm = formBuilder.group({

        name: ['',Validators.required]
       
       
      });
      this.allergyForm = formBuilder.group({
        
                name: ['',Validators.required]
               
               
              });
    this.loader = this.loadingCtrl.create({
    content: "Espere por favor...",
    
    });

    this.loader.present();
          
      
    this.getPressures();
    this.getSugars();
    this.getMedicines();
    this.getAllergies();

  }
  getAllergies(){
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
  getMedicines(){
    this.patientService.getMedicines(this.patient.id)
    .then(data => {
        
        this.medicines = data;
    

    })
    .catch(error => {
    
        console.log(error);
        
    });
  }
  getSugars(){
    this.patientService.getSugars(this.patient.id)
    .then(data => {
        
        this.sugars = data;
    

    })
    .catch(error => {
    
        console.log(error);
        
    });
  }
  getPressures(){
    this.patientService.getPressures(this.patient.id)
    .then(data => {
        
        this.pressures = data;
    

    })
    .catch(error => {
    
        console.log(error);
        
    });
  }
  saveAllergy(){
    console.log(this.allergyForm.value);
    this.submitAttempt = true;
    let message ='Alergia guardada Correctamente';
    let styleClass ='success';
   
 
    if(this.allergyForm.valid){
          this.isWaiting = true;

          this.patientService.saveAllergy(this.patient.id, this.allergyForm.value)
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
              this.allergies.push(data);
              this.isWaiting = null;
              this.submitAttempt = false;
              this.allergyForm.reset();
              
            
          

          })
          .catch(error => {
          
              this.errorSave = error.statusText;
              console.log(error);
              
          });
  }
}
deleteAllergy(allergy){
    let message ='Alergia eliminada Correctamente';
    let styleClass ='success';
   
    this.patientService.deleteAllergy(allergy.id)
    .then(resp => {
        
        let toast = this.toastCtrl.create({
            message: message,
            cssClass: 'mytoast '+ styleClass,
            duration: 3000
        });
        toast.present(toast);
        
        let index = this.allergies.indexOf(allergy)
        this.allergies.splice(index, 1);
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
  saveMedicine(){
    console.log(this.medicineForm.value);
    this.submitAttempt = true;
    let message ='Control guardado Correctamente';
    let styleClass ='success';
   
 
    if(this.medicineForm.valid){
          this.isWaiting = true;

          this.patientService.saveMedicine(this.patient.id, this.medicineForm.value)
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
              this.medicines.push(data);
              this.isWaiting = null;
              this.submitAttempt = false;
              this.medicineForm.reset();//.get('name').setValue('')
              
            
          

          })
          .catch(error => {
          
              this.errorSave = error.statusText;
              console.log(error);
              
          });
  }
}
deleteMedicine(medicine){
    let message ='Medicamento eliminado Correctamente';
    let styleClass ='success';
   
    this.patientService.deleteMedicine(medicine.id)
    .then(resp => {
        
        let toast = this.toastCtrl.create({
            message: message,
            cssClass: 'mytoast '+ styleClass,
            duration: 3000
        });
        toast.present(toast);
        
        let index = this.medicines.indexOf(medicine)
        this.medicines.splice(index, 1);
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
  saveSugar(){
    console.log(this.sugarForm.value);
    this.submitAttempt = true;
    let message ='Control guardado Correctamente';
    let styleClass ='success';
   
 
    if(this.sugarForm.valid){
          this.isWaiting = true;

          this.patientService.saveSugar(this.patient.id, this.sugarForm.value)
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
              this.sugars.push(data);
              this.isWaiting = null;
              this.submitAttempt = false;
              //this.clearSugar(this.sugarForm)
              this.sugarForm.reset();
            
          

          })
          .catch(error => {
          
              this.errorSave = error.statusText;
              console.log(error);
              
          });
  }
}
deleteSugar(sugar){
    let message ='Control eliminado Correctamente';
    let styleClass ='success';
   
    this.patientService.deleteSugar(sugar.id)
    .then(resp => {
        
        let toast = this.toastCtrl.create({
            message: message,
            cssClass: 'mytoast '+ styleClass,
            duration: 3000
        });
        toast.present(toast);
        
        let index = this.sugars.indexOf(sugar)
        this.sugars.splice(index, 1);
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
                //this.clearPressure(this.pressureForm)
                this.pressureForm.reset();
              
            

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
  clearPressure(form){
    
     form.get('date_control').setValue('')
     form.get('time_control').setValue('')
     form.get('pd').setValue('')
     form.get('ps').setValue('')
     
     
   
   }
   clearSugar(form){
    
     form.get('date_control').setValue('')
     form.get('time_control').setValue('')
     form.get('glicemia').setValue('')
     
   
   }

  ionViewDidLoad() {
    console.log('ionViewDidLoad expedientPage');
  }

}
