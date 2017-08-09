import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { MedicServiceProvider } from '../../providers/medic-service/medic-service';
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
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public medicService: MedicServiceProvider) {
       this.medicService = medicService;
       this.navCtrl = navCtrl;
     


  }
  openMedicDetail(medic: any) {
        this.navCtrl.push(MedicDetailPage, medic);
    }
  onInput(event) {
        this.medicService.findAll(this.searchKey)
            .then(data => {
                this.medics = data.data;
                
            })
            .catch(error => alert(JSON.stringify(error)));
    }

    onCancel(event) {
        //this.findAll();
        this.medics = [];
    }

   
  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchMedicPage');
  }

}
