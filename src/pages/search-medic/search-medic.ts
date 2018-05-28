import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation';
import { MedicServiceProvider } from '../../providers/medic-service/medic-service';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
import { provinces } from '../../providers/provinces';
import { SERVER_URL } from '../../providers/config';
import { MedicDetailPage } from '../medic-detail/medic-detail';
import { Diagnostic } from '@ionic-native/diagnostic';
//import { SearchValidator } from '../../validators/search';
@Component({
  selector: 'page-search-medic',
  templateUrl: 'search-medic.html',
})
export class SearchMedicPage {
  serverUrl: String = SERVER_URL;
  medics: Array<any>;
  searchKey: number = 0;
  medicSearchForm: FormGroup;
  submitAttempt: boolean = false;
  cantones: Array<any>;
  districts: Array<any>;
  specialities: Array<any>;
  currentPage: any = 1;
  lastPage: any = 1;
  shownGroup = null;
  located = null;
  lat;
  lon;
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public medicService: MedicServiceProvider, public formBuilder: FormBuilder, public geolocation: Geolocation, public networkService: NetworkServiceProvider, public alertCtrl: AlertController, private diagnostic: Diagnostic, public toastCtrl: ToastController) {

    this.navCtrl = navCtrl;
    this.medics = [];
    this.cantones = [];
    this.districts = [];
    this.createForm();

    this.loadSpecialities();

    this.diagnostic.isLocationEnabled().then(
      (isAvailable) => {
    
        if(!isAvailable){
          this.networkService.showLocationAlert();
        }
      
      
      }).catch( (e) => {
        console.log(JSON.stringify(e));
      });



  }
  createForm() {
    this.medicSearchForm = this.formBuilder.group({
      q: ['', Validators.required],
      province: [''],
      canton: [''],
      district: [''],
      speciality: [''],
      lat: [''],
      lon: [''],
      page: [1]

    });
    // }, { 'validator': SearchValidator.isNotEmpty });

  }
  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else {
      if (this.currentPage === this.lastPage) {
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
          this.searchKey = 1;
          // this.clearForm(this.medicSearchForm);

          console.log('Async operation has ended');
          infiniteScroll.complete();
        })
        .catch(error => {
          let message = 'Ha ocurrido un error cargando los médicos';

          let toast = this.toastCtrl.create({
            message: message,
            cssClass: 'mytoast error',
            duration: 3000
          });

          toast.present(toast);
         

        });
    }

  }
  onGetGeolocalitation() {
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else {

          let loader = this.loadingCtrl.create({
            content: "Buscando Coordenadas. Espere por favor...",
            //duration: 3000
          });
          loader.present();
          let options = {
            timeout: 60000
          }
          this.geolocation.getCurrentPosition(options).then((position) => {

            console.log(position.coords.latitude, position.coords.longitude);

            //this.medicSearchForm.value.lat = position.coords.latitude
            //this.medicSearchForm.value.lon = position.coords.longitude
            this.medicSearchForm.get('lat').setValue(position.coords.latitude)
            this.medicSearchForm.get('lon').setValue(position.coords.longitude)
            this.located = true;
            this.lat = position.coords.latitude;
            this.lon = position.coords.longitude;
            loader.dismiss();
            this.onSearch();

          }, (err) => {
            loader.dismiss();

            let locationAlert = this.alertCtrl.create({
              title: 'La aplicación tardo mucho en encontrar las coordenadas!',
              subTitle: 'Por favor verifica que tu GPS este activo',
              buttons:  [
                {
                  text: 'Cancelar',
                  handler: () => {
                    this.medicSearchForm.get('lat').setValue('')
                    this.medicSearchForm.get('lon').setValue('')
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
            console.log(err);
          });
      
    }
  }
  openMedicDetail(medic: any) {
    this.navCtrl.push(MedicDetailPage, medic);
  }
  onChangeProvince(evt) {
    console.log(provinces)
    this.loadCantones(evt);
  }
  onChangeCanton(evt) {
    console.log(evt)
    this.loadDistricts(evt);
  }
  loadSpecialities() {

    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else {
      this.medicService.getSpecialities().then(data => {
        console.log(data)
        this.specialities = data;

      })
        .catch(error => alert(error.statusText));
    }

  }
  loadCantones(prov) {
    provinces.forEach(provincia => {
      if (provincia.id == prov) {
        this.cantones = provincia.cantones
      }

    });
  }
  loadDistricts(cant) {

    this.cantones.forEach(canton => {

      if (canton.id == cant) {
        this.districts = canton.distritos
      }

    });

  }
  onSearch() {
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else {
      this.submitAttempt = true;
      this.medicSearchForm.get('page').setValue(1);
      this.currentPage = 1;
      this.lastPage = 1;
      if (this.medicSearchForm.valid) {

        this.fetchMedics(this.medicSearchForm.value)
      }
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

        // if(this.lat && this.lon)
        //   this.clinics = data.data;
        // else 
          this.medics = data.data;

        this.medicSearchForm.get('page').setValue(data.current_page)
        this.currentPage = data.current_page;
        this.lastPage = data.last_page;
        // this.clearForm(this.medicSearchForm);
        this.searchKey = 1;
        this.submitAttempt = false;
      })
      .catch(error => {
        let message = 'Ha ocurrido un error cargando los médicos';

        let toast = this.toastCtrl.create({
          message: message,
          cssClass: 'mytoast error',
          duration: 3000
        });

        toast.present(toast);
        loader.dismiss();
      });

  }
  clearForm(form) {
    this.medics = [];
    form.get('q').setValue('')
    form.get('province').setValue('')
    form.get('canton').setValue('')
    form.get('district').setValue('')
    form.get('speciality').setValue('')
    form.get('lat').setValue('')
    form.get('lon').setValue('')
    form.get('page').setValue(1)
    this.located = null
    this.lat = null 
    this.lon = null
    this.searchKey = 0;
    

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
    console.log('ionViewDidLoad SearchMedicPage');
  }
  ngOnInit() {

    console.log('on init')
    this.medicSearchForm.get('province').valueChanges.subscribe(

      (province: string) => {

        if (province != '') {

          this.medicSearchForm.get('q').setValidators([]);

        } else {

          this.medicSearchForm.get('q').setValidators([Validators.required]);
        }

        this.medicSearchForm.get('q').updateValueAndValidity();

      }

    )

    this.medicSearchForm.get('speciality').valueChanges.subscribe(

      (speciality: string) => {

        if (speciality != '') {

          this.medicSearchForm.get('q').setValidators([]);

        } else {

          this.medicSearchForm.get('q').setValidators([Validators.required]);
        }

        this.medicSearchForm.get('q').updateValueAndValidity();

      }

    )
    this.medicSearchForm.get('lat').valueChanges.subscribe(

      (lat: string) => {

        if (lat != '') {

          this.medicSearchForm.get('q').setValidators([]);

        } else {

          this.medicSearchForm.get('q').setValidators([Validators.required]);
        }

        this.medicSearchForm.get('q').updateValueAndValidity();

      }

    )
  }

}
