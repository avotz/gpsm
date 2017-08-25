import { Component } from '@angular/core';
import { Platform, ActionSheetController, ActionSheet,  NavController, NavParams } from 'ionic-angular';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import {SERVER_URL} from '../../providers/config';
import {MedicCalendarPage} from '../medic-calendar/medic-calendar';
import { MedicServiceProvider } from '../../providers/medic-service/medic-service';
import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
  selector: 'page-medic-detail',
  templateUrl: 'medic-detail.html',
})
export class MedicDetailPage {
  
  serverUrl: String = SERVER_URL;
  medic: any;
  isWaiting: boolean = null;

  constructor(public platform: Platform, public actionSheetCtrl: ActionSheetController, public navCtrl: NavController, public navParams: NavParams, public medicService: MedicServiceProvider, private socialSharing: SocialSharing, private launchNavigator: LaunchNavigator) {
    
    this.medic = this.navParams.data;
    this.isWaiting = true;
    this.medicService.findById(this.medic.id)
    .then(resp => {
        this.medic = resp.data;
        this.isWaiting = null;
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
