import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation';
import { MedicServiceProvider } from '../../providers/medic-service/medic-service';
import { provinces } from '../../providers/provinces';
import {SERVER_URL} from '../../providers/config';
import {MedicDetailPage} from '../medic-detail/medic-detail';
//import { SearchValidator } from '../../validators/search';
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
    currentPage: any = 1;
    lastPage:any = 1;
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
      lon:[''],
      page:[1]
      
    });
    // }, { 'validator': SearchValidator.isNotEmpty });

  }
  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

      
    if(this.currentPage === this.lastPage)
      {
        infiniteScroll.complete();
        return
      }


      this.medicSearchForm.get('page').setValue(this.currentPage + 1)
    
          this.medicService.findAll(this.medicSearchForm.value)
          .then(data => {
            
    
              data.data.forEach(medic => {
                this.medics.push(medic);
              });
              
              this.medicSearchForm.get('page').setValue(data.currentPage)
              this.currentPage = data.current_page;
              this.lastPage = data.last_page;
             // this.clearForm(this.medicSearchForm);

             console.log('Async operation has ended');
             infiniteScroll.complete();
          })
          .catch(error => {
            console.log(JSON.stringify(error))
           
          });

     
  }
  onGetGeolocalitation () {
    
    this.geolocation.getCurrentPosition().then((position) => {
           
           console.log(position.coords.latitude, position.coords.longitude);
      
            //this.medicSearchForm.value.lat = position.coords.latitude
            //this.medicSearchForm.value.lon = position.coords.longitude
            this.medicSearchForm.get('lat').setValue(position.coords.latitude)
            this.medicSearchForm.get('lon').setValue(position.coords.latitude)
    
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
    this.medicSearchForm.get('page').setValue(1);
    this.currentPage = 1;
    this.lastPage = 1;
    if(this.medicSearchForm.valid){

      this.fetchMedics(this.medicSearchForm.value) 
    }
  }
  onInput(event) {
    this.onSearch();
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
                    this.medicSearchForm.get('page').setValue(data.current_page)
                    this.currentPage = data.current_page;
                    this.lastPage = data.last_page;
                   // this.clearForm(this.medicSearchForm);
                    this.submitAttempt = false;
                })
                .catch(error => {
                  console.log(JSON.stringify(error))
                  loader.dismiss();
                });
        
  }
  clearForm(form){
   
    form.get('q').setValue('')
    form.get('province').setValue('')
    form.get('canton').setValue('')
    form.get('district').setValue('')
    form.get('speciality').setValue('')
    form.get('lat').setValue('')
    form.get('lon').setValue('')
    form.get('page').setValue(1)
  
  }
  

   
  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchMedicPage');
  }
  ngOnInit() {
   
    console.log('on init')
    this.medicSearchForm.get('province').valueChanges.subscribe(
      
          (province: string) => {
            
              if (province != '') {
      
                  this.medicSearchForm.get('q').setValidators([]);
      
              }else{
                
                this.medicSearchForm.get('q').setValidators([Validators.required]);
              }
             
              this.medicSearchForm.get('q').updateValueAndValidity();
      
          }
      
      )

    this.medicSearchForm.get('speciality').valueChanges.subscribe(
        
            (speciality: string) => {
              
                if (speciality != '') {
        
                    this.medicSearchForm.get('q').setValidators([]);
        
                }else{
                  
                  this.medicSearchForm.get('q').setValidators([Validators.required]);
                }
               
                this.medicSearchForm.get('q').updateValueAndValidity();
        
            }
        
        )
        this.medicSearchForm.get('lat').valueChanges.subscribe(
          
              (lat: string) => {
                 
                  if (lat != '') {
          
                      this.medicSearchForm.get('q').setValidators([]);
          
                  }else{
                    
                    this.medicSearchForm.get('q').setValidators([Validators.required]);
                  }
                 
                  this.medicSearchForm.get('q').updateValueAndValidity();
          
              }
          
          )
  }

}
