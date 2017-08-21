import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { MedicServiceProvider } from '../../providers/medic-service/medic-service';
import { ModalReservationPage } from './modal-reservation';
import moment from 'moment'
@Component({
  selector: 'page-medic-calendar',
  templateUrl: 'medic-calendar.html',
})
export class MedicCalendarPage {
  
  params:any;
  calendar : any;
  eventSource: any[] = [];
  schedules: any[] = [];
  appointments: any[] = [];
  loader: any;
  authUser: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public medicService: MedicServiceProvider, public modalCtrl: ModalController, public loadingCtrl: LoadingController) {

    this.authUser = JSON.parse(window.localStorage.getItem('auth_user'));
    this.params = this.navParams.data;
    this.calendar = {
        currentDate:new Date(),
        mode: 'month'
    } 
    
  }
  
  markDisabled (date){
      
      var current =  moment().format("YYYY-MM-DD");
      var dateCal = moment(date).format("YYYY-MM-DD");
      return moment(dateCal).isBefore(current) //dateCal < current;
  }

  loadAppointments (date_from, date_to) {
  
    let loader = this.loadingCtrl.create({
      content: "Espere por favor...",
     
    });

    loader.present();

    this.medicService.findAppointments(this.params.medic.id, this.params.clinic.id, date_from, date_to)
    .then(data => {
        this.appointments = [];

        data.forEach(appointment => {
          
          this.appointments.push(appointment);
        
        });
       
        this.loadSchedules(date_from, date_to, loader);
        
       
    })
    .catch(error => alert(JSON.stringify(error)));

  }

  loadSchedules (date_from, date_to, loader) {
    
    this.medicService.findSchedules(this.params.medic.id, this.params.clinic.id, date_from, date_to)
    .then(data => {
       
        data.forEach(schedule => {
          
          let intervals = this.createIntervalsFromHours(moment(schedule.start).format("YYYY-MM-DD"), moment(schedule.start).format("HH:mm"), moment(schedule.end).format("HH:mm"), moment.duration(schedule.user.settings.slotDuration).asMinutes());

         
          let events = [];
          let title = 'Disponible';
          let startEvent;
          let endEvent;
          let reserved;
          let reservedType;
          for (var i = 0; i < intervals.length; i++) {
            
            startEvent = moment(schedule.start).format("YYYY-MM-DD") +'T'+ intervals[i]+':00';
            endEvent = moment(schedule.start).format("YYYY-MM-DD") +'T'+ intervals[i+1]+':00';
            reservedType = this.isReserved(startEvent, endEvent);
            if(reservedType){
              if(reservedType == 1){
                title = 'No Disponible';
                reserved = 1;
              }
              else {
                title = 'Reservado';
                reserved = 2;
              }
             
             } else {
              title = 'Disponible';
              reserved = 0;
             }
            
            let event = {
                title: title,
                startTime: new Date(moment(schedule.start).format("YYYY-MM-DD") +' '+ intervals[i]),
                endTime: new Date(moment(schedule.start).format("YYYY-MM-DD") +' '+ intervals[i+1]),
                startFormatted: moment(schedule.start).format("YYYY-MM-DD") +' '+ intervals[i]+':00',
                endFormatted:  moment(schedule.start).format("YYYY-MM-DD") +' '+ intervals[i+1]+':00',
                start:startEvent,
                end: endEvent,
                allDay: false,
                reserved: reserved,
                office_id: this.params.clinic.id,
                medic_id: this.params.medic.id,
                office: this.params.clinic,
                medic: this.params.medic

            }

            events.push(event);
            
          }

          this.eventSource = events;
          
        
        });

        loader.dismiss();
        
    })
    .catch(error => alert(JSON.stringify(error)));

  }

  isReserved(startSchedule, endSchedule){
    let res = 0;
    for (var j = 0; j < this.appointments.length; j++) {
      
      if (this.appointments[j].end > startSchedule && this.appointments[j].start < endSchedule){

          if(this.appointments[j].created_by == this.authUser.id) //si fue el usuario logueado que creo la cita cambia el titulo a reservado
            res = 2;
          else /// se pone titulo en no disponible
            res = 1
        }

    }
    return res
                  
  }

  createIntervalsFromHours(date, from, until, slot){
     
     until = Date.parse(date+" " + until);
     from = Date.parse(date+" " + from);

     let intervalLength = (slot) ? slot : 30;
     let intervalsPerHour = 60 / intervalLength;
     let milisecsPerHour = 60 * 60 * 1000;
    
     let max = (Math.abs(until-from) / milisecsPerHour)* intervalsPerHour;
           
     let time = new Date(from);
     let intervals = [];
     for(let i = 0; i <= max; i++){
        //doubleZeros just adds a zero in front of the value if it's smaller than 10.
        let hour = this.doubleZeros(time.getHours());
        let minute = this.doubleZeros(time.getMinutes());
        intervals.push(hour+":"+minute);
        time.setMinutes(time.getMinutes()+intervalLength);
     }
    return intervals;
  }


  doubleZeros(item){

    return (item < 10 ) ? '0'+ item : item;
  }

  onEventSelected (evt){
    console.log(evt)
    if(evt.reserved == 1) return

    let current = new Date();
    
    if(evt.startTime < current) return 

    if(evt.reserved == 2)
        evt.show = 1;
    
    let modal = this.modalCtrl.create(ModalReservationPage, evt);
    modal.onDidDismiss(data => {
      
      if(data)
        this.onCurrentDateChanged(data.date);

    });
    modal.present();
  }
 
  onCurrentDateChanged(date){

    let dateFrom = moment(date).format('YYYY-MM-DD');
    let dateTo = dateFrom; //moment(lastDay).format('YYYY-MM-DD');
    

    console.log(dateFrom +' - '+ dateTo)
     this.loadAppointments(dateFrom, dateTo);
   

  }
 

}
