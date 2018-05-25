import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation';
import { ClinicServiceProvider } from '../../providers/clinic-service/clinic-service';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
import { provinces } from '../../providers/provinces';
import {SERVER_URL} from '../../providers/config';
import {ClinicDetailPage} from '../clinic-detail/clinic-detail';
import { Diagnostic } from '@ionic-native/diagnostic';
//import { SearchValidator } from '../../validators/search';
@Component({
  selector: 'page-search-clinic',
  templateUrl: 'search-clinic.html',
})
export class SearchClinicPage {
    serverUrl: String = SERVER_URL;
    clinics: Array<any>;
    searchKey: number = 0;
    clinicSearchForm: FormGroup;
    submitAttempt: boolean = false;
    cantones:Array<any>;
    districts:Array<any>;
    currentPage: any = 1;
    lastPage:any = 1;
    shownGroup = null;
    located = null;
    lat;
    lon;
    constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public clinicService: ClinicServiceProvider, public formBuilder: FormBuilder, public geolocation: Geolocation, public networkService: NetworkServiceProvider, public alertCtrl: AlertController, private diagnostic: Diagnostic, public toastCtrl: ToastController) {
      
       this.navCtrl = navCtrl;
       this.clinics = [];
       this.cantones = [];
       this.districts = [];
       this.createForm();
       
       this.diagnostic.isLocationEnabled().then(
        (isAvailable) => {
      
          if(!isAvailable){
            this.networkService.showLocationAlert();
          }
        
        
        }).catch( (e) => {
          console.log(JSON.stringify(e));
        });
      



  }
  createForm(){
    this.clinicSearchForm = this.formBuilder.group({
      q: ['',Validators.required],
      province: [''],
      canton: [''],
      district: [''],
      lat:[''],
      lon:[''],
      page:[1]
      
    });
    // }, { 'validator': SearchValidator.isNotEmpty });

  }
  doInfinite(infiniteScroll) {
    console.log('Begin async operation');
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else {
      
    if(this.currentPage === this.lastPage)
      {
        infiniteScroll.complete();
        return
      }


      this.clinicSearchForm.get('page').setValue(this.currentPage + 1)
    
          this.clinicService.findAll(this.clinicSearchForm.value)
          .then(data => {
            
    
              data.data.forEach(medic => {
                this.clinics.push(medic);
              });
              
              this.clinicSearchForm.get('page').setValue(data.currentPage)
              this.currentPage = data.current_page;
              this.lastPage = data.last_page;
             // this.clearForm(this.clinicSearchForm);
             this.searchKey = 1;
             console.log('Async operation has ended');
             infiniteScroll.complete();
          })
          .catch(error => {
            let message = 'Ha ocurrido un error cargando las clinicas';

            let toast = this.toastCtrl.create({
              message: message,
              cssClass: 'mytoast error',
              duration: 3000
            });

            toast.present(toast);
           
          });

   }
  }
  onGetGeolocalitation () {
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else {
     
            let loader = this.loadingCtrl.create({
              content: "Buscando Coordenadas. Espere por favor...",
              //duration: 3000
            });
            let options = {
              timeout: 60000
            }
            loader.present();

          this.geolocation.getCurrentPosition(options).then((position) => {
                
                console.log(position.coords.latitude, position.coords.longitude);
            
                  //this.clinicSearchForm.value.lat = position.coords.latitude
                  //this.clinicSearchForm.value.lon = position.coords.longitude
                  this.clinicSearchForm.get('lat').setValue(position.coords.latitude)
                  this.clinicSearchForm.get('lon').setValue(position.coords.longitude)
                  this.located = true;
                  this.lat = position.coords.latitude;
                  this.lon = position.coords.longitude;
                  loader.dismiss();
                  this.onSearch();
            
              }, (err) => {
                let locationAlert = this.alertCtrl.create({
                  title: 'La aplicación tardo mucho en encontrar las coordenadas!',
                  subTitle: 'Por favor verifica que tu GPS este activo',
                  buttons:  [
                    {
                      text: 'Cancelar',
                      handler: () => {
                        this.clinicSearchForm.get('lat').setValue('')
                        this.clinicSearchForm.get('lon').setValue('')
                        this.lat = null
                        this.lon = null
                        this.located = null
                      }
                    },
                    {
                      text: 'Reintentar',
                      handler: () => {
                        this.onGetGeolocalitation()
                      }
                    }
                  ]
                });
    
                locationAlert.present();
                  loader.dismiss();
                console.log(err);
              });
        
      }
  }
  openClinicDetail(clinic: any) {
        this.navCtrl.push(ClinicDetailPage, clinic);
  }
  onChangeProvince (evt) {
    console.log(provinces)
    this.loadCantones(evt);
  }
  onChangeCanton (evt) {
    console.log(evt)
    this.loadDistricts(evt);
  }
  loadCantones(prov) {
    provinces.forEach(provincia => {
      if(provincia.id == prov)
      {
        this.cantones = provincia.cantones
      }

    });
  }
  loadDistricts(cant) {

    this.cantones.forEach(canton => {
     
      if(canton.id == cant)
      {
        this.districts = canton.distritos
      }

    });

  }
  onSearch(){
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else {
      this.submitAttempt = true;
      this.clinicSearchForm.get('page').setValue(1);
      this.currentPage = 1;
      this.lastPage = 1;
      if(this.clinicSearchForm.valid){

        this.fetchClinics(this.clinicSearchForm.value) 
      }
    }
  }
  onInput(event) {
    this.onSearch();
  }

  onCancel(event) {
        //this.findAll();
        this.clinics = [];
  }

  fetchClinics(search) {
        this.clinics = [];
        let loader = this.loadingCtrl.create({
          content: "Buscando. Espere por favor...",
          //duration: 3000
        });
    
        loader.present();
    
    
       
  
        
          this.clinicService.findAll(search)
                .then(data => {
                    loader.dismiss();

                    this.clinics = data.data;
                    this.clinicSearchForm.get('page').setValue(data.current_page)
                    this.currentPage = data.current_page;
                    this.lastPage = data.last_page;
                   // this.clearForm(this.clinicSearchForm);
                    this.submitAttempt = false;
                    this.searchKey = 1;
                })
                .catch(error => {
                  let message = 'Ha ocurrido un error cargando las clinicas';

                  let toast = this.toastCtrl.create({
                    message: message,
                    cssClass: 'mytoast error',
                    duration: 3000
                  });

                  toast.present(toast);
                  loader.dismiss();
                });
        
  }
  clearForm(form){
    this.clinics = [];
    form.get('q').setValue('')
    form.get('province').setValue('')
    form.get('canton').setValue('')
    form.get('district').setValue('')
    form.get('lat').setValue('')
    form.get('lon').setValue('')
    form.get('page').setValue(1)
    this.searchKey = 0;
    this.lat = null;
    this.lon = null;
    this.located = null;
  }
  toggleGroup(group) {
      if (this.isGroupShown(group)) {
          this.shownGroup = null;
      } else {
          this.shownGroup = group;
      }
  }

  isGroupShown(group) {
      return this.shownGroup === group;
  }
  

   
  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchClinicPage');
  }
  ngOnInit() {
   
    console.log('on init')
    this.clinicSearchForm.get('province').valueChanges.subscribe(
      
          (province: string) => {
            
              if (province != '') {
      
                  this.clinicSearchForm.get('q').setValidators([]);
      
              }else{
                
                this.clinicSearchForm.get('q').setValidators([Validators.required]);
              }
             
              this.clinicSearchForm.get('q').updateValueAndValidity();
      
          }
      
      )

        this.clinicSearchForm.get('lat').valueChanges.subscribe(
          
              (lat: string) => {
                 
                  if (lat != '') {
          
                      this.clinicSearchForm.get('q').setValidators([]);
          
                  }else{
                    
                    this.clinicSearchForm.get('q').setValidators([Validators.required]);
                  }
                 
                  this.clinicSearchForm.get('q').updateValueAndValidity();
          
              }
          
          )
  }

}
