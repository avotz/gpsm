import { Component } from '@angular/core';
import { ActionSheetController, ActionSheet, NavController, NavParams } from 'ionic-angular';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { SERVER_URL } from '../../providers/config';
import { MedicCalendarPage } from '../medic-calendar/medic-calendar';
import { MedicDetailPage } from '../medic-detail/medic-detail';
import { MedicServiceProvider } from '../../providers/medic-service/medic-service';
import { ClinicServiceProvider } from '../../providers/clinic-service/clinic-service';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
import { SocialSharing } from '@ionic-native/social-sharing';
@Component({
    selector: 'page-clinic-detail',
    templateUrl: 'clinic-detail.html',
})
export class ClinicDetailPage {
    serverUrl: String = SERVER_URL;
    clinic: any;
    isWaiting: boolean = null;
    constructor(public actionSheetCtrl: ActionSheetController, public navCtrl: NavController, public navParams: NavParams, public medicService: MedicServiceProvider, public clinicService: ClinicServiceProvider, public networkService: NetworkServiceProvider, private socialSharing: SocialSharing, private launchNavigator: LaunchNavigator) {

        this.clinic = this.navParams.data;

        if (this.networkService.noConnection()) {
            this.networkService.showNetworkAlert();
        } else {
            this.isWaiting = true;
            this.clinicService.findById(this.clinic.id)
                .then(resp => {
                    this.clinic = resp;
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
        let url = `http://maps.google.com/?saddr=Current+Location&daddr=${clinic.lat},${clinic.lon}`
        let actionSheet: ActionSheet = this.actionSheetCtrl.create({
            title: 'Ubicación de la Clínica',
            buttons: [
               
                {
                    text: 'Compartir Ubicación',
                    handler: () => {
                        this.socialSharing.share('Ubicación de la clínica','Ubicación de '+ clinic.name,null, url).then(() => {
                            // Success!
                          }).catch(() => {
                            // Error!
                          });
                    }
                },
                {
                    text: 'Abrir Ubicación',
                    handler: () => {
                        let destination = clinic.lat + ',' + clinic.lon;
                        let options: LaunchNavigatorOptions = {
                            
                            //app: LaunchNavigator.APPS.UBER
                          };
                          
                          this.launchNavigator.navigate(destination, options)
                            .then(
                              success => console.log('Launched navigator'),
                              error => console.log('Error launching navigator', error)
                            );

                        // let destination = clinic.lat + ',' + clinic.lon;
                        
                        // if(this.platform.is('ios')){
                        //     window.open('maps://?q=' + destination, '_system');
                        //    // window.open('maps:?daddr=' + destination, '_system');
                            
                        // } else {
                        //     let label = encodeURI('Ubicación de '+ clinic.name);
                        //     window.open('geo:0,0?q=' + destination + '(' + label + ')', '_system');
                        //     //window.open('geo:?daddr=' + destination + '(' + label + ')', '_system');
                          
                            
                        // }

                    }
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
