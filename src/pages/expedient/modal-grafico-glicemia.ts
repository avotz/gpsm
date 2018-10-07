import { Component, ViewChild } from '@angular/core';
import { Platform, NavParams, ViewController, ToastController, LoadingController } from 'ionic-angular';
import { SERVER_URL } from '../../providers/config';
import moment from 'moment'
import { Chart } from 'chart.js';

@Component({
  selector: 'modal-grafico-glicemia',
  templateUrl: 'modal-grafico-glicemia.html',
})
export class ModalGraficoGlicemiaPage {
    //@ViewChild('barCanvas') barCanvas;
    @ViewChild('lineCanvas') lineCanvas;
  serverUrl: String = SERVER_URL;
  authUser: any;
  barChart: any;
  lineChart: any;
  isWaiting: boolean = null;
  sugars: any = [];

  constructor(public platform: Platform, public navParams: NavParams, public viewCtrl: ViewController, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {

    this.sugars = this.navParams.data;


    this.authUser = JSON.parse(window.localStorage.getItem('auth_user'));

    

  }
  ionViewDidLoad() {
 
    let labels = [];
    let data = [];
    
    this.sugars.forEach(element => {
        console.log(element.date_control)
        labels.unshift(this.dateFormat(element.date_control))
        data.unshift(element.glicemia)
       
    });
    
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
 
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Glicemia",
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(75,192,192,1)",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "rgba(255, 99, 132, 1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: data,
                    spanGaps: false,
                }
                
            ]
        }

    });
}
  
  parseDate(date) {
    return moment(date).format('YYYY-MM-DD HH:mm');
  }
  timeFormat(date) {
    return moment(date).format('h:mm A');
  }
  dateFormat(date) {
    return moment(date).format('YYYY-MM-DD');
  }
  
  dismiss() {

    this.viewCtrl.dismiss();

  }

}
