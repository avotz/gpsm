import { Injectable } from '@angular/core';
import {AlertController} from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { Diagnostic } from '@ionic-native/diagnostic';


@Injectable()
export class NetworkServiceProvider {

  constructor(private network: Network, private diagnostic: Diagnostic, public alertCtrl: AlertController) {
    console.log('Hello NetworkServiceProvider Provider');
    
  }

  noConnection() {
    return (this.network.type === 'none');
  }


  private showSettings() {
    if (this.diagnostic.switchToWifiSettings) {
        this.diagnostic.switchToWifiSettings();
    } else {
        this.diagnostic.switchToSettings();
    }
  }
  showNetworkAlert() {
    let networkAlert = this.alertCtrl.create({
        title: 'No hay Conexión a internet!',
        subTitle: 'Por favor verifica tu conexión',
        buttons:  [
            {
              text: 'Cancelar',
              handler: () => {}
            },
            {
              text: 'Abrir Settings',
              handler: () => {
                networkAlert.dismiss().then(() => {
                  this.showSettings();
                })
              }
            }
          ]
      });
      networkAlert.present();
    
  }

}
