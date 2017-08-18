import { Component } from '@angular/core';
import { ActionSheetController, ActionSheet,  NavController, NavParams } from 'ionic-angular';
import {SERVER_URL} from '../../providers/config';
import {MedicCalendarPage} from '../medic-calendar/medic-calendar';
import { MedicServiceProvider } from '../../providers/medic-service/medic-service';


@Component({
  selector: 'page-medic-detail',
  templateUrl: 'medic-detail.html',
})
export class MedicDetailPage {
  serverUrl: String = SERVER_URL;
  medic: any;
  
  constructor(public actionSheetCtrl: ActionSheetController, public navCtrl: NavController, public navParams: NavParams, public medicService: MedicServiceProvider) {
    
    this.medic = this.navParams.data;

    this.medicService.findById(this.medic.id)
    .then(resp => {
        this.medic = resp.data;
        
    })
    .catch(error => alert(JSON.stringify(error)));

  }
  
   openCalendar(medic, clinic) {
   
    let calendarOptions = {
      medic: medic,
      clinic: clinic
      
    }

    this.navCtrl.push(MedicCalendarPage, calendarOptions);
  }

   share(medic) {
        let actionSheet: ActionSheet = this.actionSheetCtrl.create({
            title: 'Compartir ubicación',
            buttons: [
                {
                    text: 'Twitter',
                    handler: () => console.log('share via twitter')
                },
                {
                    text: 'Facebook',
                    handler: () => console.log('share via facebook')
                },
                {
                    text: 'Google+',
                    handler: () => console.log('share via google')
                },
                {
                    text: 'Correo',
                    handler: () => console.log('share via email')
                },
                {
                    text: 'Abrir en Waze',
                    handler: () => console.log('share via Waze')
                },
                {
                    text: 'Abrir en Maps',
                    handler: () => console.log('share via Maps')
                },
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    handler: () => console.log('cancel share')
                }
            ]
        });

        actionSheet.present();
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MedicDetailPage');
  }

}
