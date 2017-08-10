import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation';
import { MedicServiceProvider } from '../../providers/medic-service/medic-service';
import { provinces } from '../../providers/provinces';
import {SERVER_URL} from '../../providers/config';
import {MedicDetailPage} from '../medic-detail/medic-detail';

@Component({
  selector: 'page-search-medic',
  templateUrl: 'search-medic.html',
})
export class SearchMedicPage {
    serverUrl: String = SERVER_URL;
    medics: Array<any>;
    searchKey: string = "";
    medicSearchForm: FormGroup;
    submitAttempt: boolean = false;
    cantones:Array<any>;
    districts:Array<any>;
    specialities:Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public medicService: MedicServiceProvider, public formBuilder: FormBuilder, public geolocation: Geolocation) {
       this.medicService = medicService;
       this.navCtrl = navCtrl;
       this.medics = [];
       this.cantones = [];
       this.districts = [];
       this.createForm();
       
      this.loadSpecialities();



  }
  createForm(){
    this.medicSearchForm = this.formBuilder.group({
      q: ['',Validators.required],
      province: [''],
      canton: [''],
      district: [''],
      speciality:[''],
      lat:[''],
      lon:['']
      
     
    });

  }
  onGetGeolocalitation () {
    this.geolocation.getCurrentPosition().then((position) => {
      
           console.log(position.coords.latitude, position.coords.longitude);
      
            this.medicSearchForm.value.lat = position.coords.latitude
            this.medicSearchForm.value.lon = position.coords.longitude
            
            this.onSearch();
      
         }, (err) => {
           console.log(err);
         });
  }
  openMedicDetail(medic: any) {
        this.navCtrl.push(MedicDetailPage, medic);
  }
  onChangeProvince (evt) {
    console.log(provinces)
    this.loadCantones(evt);
  }
  onChangeCanton (evt) {
    console.log(evt)
    this.loadDistricts(evt);
  }
  loadSpecialities () {

      this.medicService.getSpecialities().then(data => {
        console.log(data)
        this.specialities = data;
        
    })
    .catch(error => alert(JSON.stringify(error)));

  }
  loadCantones(prov) {
    provinces.forEach(provincia => {
      if(provincia.title == prov)
      {
        this.cantones = provincia.cantones
      }

    });
  }
  loadDistricts(cant) {

    this.cantones.forEach(canton => {
     
      if(canton.title == cant)
      {
        this.districts = canton.distritos
      }

    });

  }
  onSearch(){
    this.submitAttempt = true;
    
    if(this.medicSearchForm.valid){

      this.fetchMedics(this.medicSearchForm.value) 
    }
  }
  onInput(event) {
    //this.fetchMedics() 
  }

  onCancel(event) {
        //this.findAll();
        this.medics = [];
  }

  fetchMedics(search) {
        this.medics = [];
        let loader = this.loadingCtrl.create({
          content: "Buscando. Espere por favor...",
          //duration: 3000
        });
    
        loader.present();
    
    
       
  
        
          this.medicService.findAll(search)
                .then(data => {
                    loader.dismiss();

                    this.medics = data.data;
                    this.createForm();
                })
                .catch(error => {
                  console.log(JSON.stringify(error))
                  loader.dismiss();
                });
        
  }
  

   
  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchMedicPage');
  }

}
