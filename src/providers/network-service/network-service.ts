import { Injectable } from '@angular/core';
import {AlertController, Platform} from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { Diagnostic } from '@ionic-native/diagnostic';


@Injectable()
export class NetworkServiceProvider {

  constructor(private network: Network, private diagnostic: Diagnostic, public alertCtrl: AlertController,  public platform: Platform) {
    console.log('Hello NetworkServiceProvider Provider');
    
  }

  noConnection() {
    return (this.network.type === 'none');
  }

  noLocation(){
    return this.diagnostic.isLocationEnabled().then(
      (isAvailable) => {
    

       // alert('geolocalitation-'+ isAvailable);

        return isAvailable;
      
      }).catch( (e) => {
        return false
      });
  }


  private showSettings() {
    if (this.diagnostic.switchToWifiSettings) {
        this.diagnostic.switchToWifiSettings();
    } else {
        this.diagnostic.switchToSettings();
    }
  }
  showNetworkAlert() {
    let buttons = [];
    
      if (this.platform.is('android')) {
          buttons = [
            {
              text: 'Cancelar',
              handler: () => {}
            },
            {
              text: 'Abrir Opciones',
              handler: () => {
                networkAlert.dismiss().then(() => {
                  this.showSettings();
                })
              }
            }
          ];
      }else{
        buttons = [
          {
            text: 'Aceptar',
            handler: () => {}
          },
        ];
      }
    let networkAlert = this.alertCtrl.create({
        title: 'No hay Conexión a internet!',
        subTitle: 'Por favor verifica tu conexión',
        buttons:  buttons
      });

      networkAlert.present();
    
  }
  showLocationAlert() {
    let buttons = [];

    if (this.platform.is('android')) {
        buttons = [
          {
            text: 'Cancelar',
            handler: () => {}
          },
          {
            text: 'Abrir Opciones',
            handler: () => {
              locationAlert.dismiss().then(() => {
                this.diagnostic.switchToLocationSettings();
              })
            }
          }
        ];
    }else{
      buttons = [
        {
          text: 'Aceptar',
          handler: () => {}
        },
      ];
    }

    let locationAlert = this.alertCtrl.create({
        title: 'No tienes activado el GPS!',
        subTitle: 'Para utilizar la función CERCA DE AQUÍ necesitas activar tu GPS',
        buttons: buttons
      });

      locationAlert.present();
    
  }

}
