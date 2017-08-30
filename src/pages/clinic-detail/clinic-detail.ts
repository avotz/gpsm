import { Component } from '@angular/core';
import { ActionSheetController, ActionSheet, NavController, NavParams } from 'ionic-angular';
import { SERVER_URL } from '../../providers/config';
import { MedicCalendarPage } from '../medic-calendar/medic-calendar';
import { MedicDetailPage } from '../medic-detail/medic-detail';
import { MedicServiceProvider } from '../../providers/medic-service/medic-service';
import { ClinicServiceProvider } from '../../providers/clinic-service/clinic-service';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';

@Component({
    selector: 'page-clinic-detail',
    templateUrl: 'clinic-detail.html',
})
export class ClinicDetailPage {
    serverUrl: String = SERVER_URL;
    clinic: any;
    isWaiting: boolean = null;
    constructor(public actionSheetCtrl: ActionSheetController, public navCtrl: NavController, public navParams: NavParams, public medicService: MedicServiceProvider, public clinicService: ClinicServiceProvider, public networkService: NetworkServiceProvider) {

        this.clinic = this.navParams.data;

        if (this.networkService.noConnection()) {
            this.networkService.showNetworkAlert();
        } else {
            this.isWaiting = true;
            this.clinicService.findById(this.clinic.id)
                .then(resp => {
                    this.clinic = resp.data;
                    this.isWaiting = null;
                })
                .catch(error => alert(JSON.stringify(error)));
        }
    }

    openMedicDetail(medic: any) {
        this.navCtrl.push(MedicDetailPage, medic);
    }

    openCalendar(medic, clinic) {

        let calendarOptions = {
            medic: medic,
            clinic: clinic

        }

        this.navCtrl.push(MedicCalendarPage, calendarOptions);
    }

    share(clinic) {
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
