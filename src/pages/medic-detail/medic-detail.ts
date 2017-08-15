import { Component } from '@angular/core';
import { ActionSheetController, ActionSheet,  NavController, NavParams } from 'ionic-angular';
import {SERVER_URL} from '../../providers/config';
import {MedicCalendarPage} from '../medic-calendar/medic-calendar';
import moment from 'moment'

@Component({
  selector: 'page-medic-detail',
  templateUrl: 'medic-detail.html',
})
export class MedicDetailPage {
  serverUrl: String = SERVER_URL;
  medic: any;
  constructor(public actionSheetCtrl: ActionSheetController, public navCtrl: NavController, public navParams: NavParams) {
    this.medic = this.navParams.data;
  }

  openCalendar(medic, clinic) {
   
    let calendarOptions = {
      medic_id: medic.id,
      clinic_id: clinic.id,
      slot_duration: moment.duration(medic.slot).asMinutes()
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
