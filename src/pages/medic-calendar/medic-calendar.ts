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
   //@ViewChild(CalendarComponent) myCalendar:CalendarComponent;
  params:any;
  calendar : any;
  eventSource: any[] = [];
  schedules: any[] = [];
  appointments: any[] = [];
  loader: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public medicService: MedicServiceProvider, public modalCtrl: ModalController, public loadingCtrl: LoadingController) {
      this.params = this.navParams.data;
      this.calendar = {
        currentDate:new Date(),
        mode: 'month'
      }
      
     this.loader = this.loadingCtrl.create({
      content: "Espere por favor...",
      
    });

   
     

    
  }
  loadAppointments (date_from, date_to) {
    let loader = this.loadingCtrl.create({
      content: "Espere por favor...",
      //duration: 3000
    });

     loader.present();

    this.medicService.findAppointments(this.params.medic_id, this.params.clinic_id, date_from, date_to)
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
    
  
    
    this.medicService.findSchedules(this.params.medic_id, this.params.clinic_id, date_from, date_to)
    .then(data => {
       
        data.forEach(schedule => {
          
          let intervals = this.createIntervalsFromHours(moment(schedule.start).format("YYYY-MM-DD"), moment(schedule.start).format("HH:mm"), moment(schedule.end).format("HH:mm"), moment.duration(schedule.user.settings.slotDuration).asMinutes());

         
          let events = [];
          let title = 'Disponible';
          let startEvent;
          let endEvent;
          let reserved;
          
          for (var i = 0; i < intervals.length; i++) {
            
            startEvent = moment(schedule.start).format("YYYY-MM-DD") +'T'+ intervals[i]+':00';
            endEvent = moment(schedule.start).format("YYYY-MM-DD") +'T'+ intervals[i+1]+':00';

            if(this.isReserved(startEvent, endEvent)){
              title = 'No Disponible';
              reserved = 1;
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
                office_id: this.params.clinic_id,
                medic_id: this.params.medic_id

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
    let res = false;
    for (var j = 0; j < this.appointments.length; j++) {
      
      if (this.appointments[j].end > startSchedule && this.appointments[j].start < endSchedule){
          res = true;
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
    
    var max = (Math.abs(until-from) / milisecsPerHour)* intervalsPerHour;
           
    var time = new Date(from);
    var intervals = [];
    for(var i = 0; i <= max; i++){
        //doubleZeros just adds a zero in front of the value if it's smaller than 10.
        var hour = this.doubleZeros(time.getHours());
        var minute = this.doubleZeros(time.getMinutes());
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
    if(evt.reserved) return
    
    let modal = this.modalCtrl.create(ModalReservationPage, evt);
    modal.onDidDismiss(data => {
      
      if(data)
        this.onCurrentDateChanged(data.date);

    });
    modal.present();
  }
  onViewTitleChanged (evt){

  }
  onTimeSelected (evt){
   // console.log(evt.selectedTime)
  }
  onCurrentDateChanged(date){
    
    let dateFrom = moment(date).format('YYYY-MM-DD');
    let dateTo = dateFrom; //moment(lastDay).format('YYYY-MM-DD');
    

    console.log(dateFrom +' - '+ dateTo)
     this.loadAppointments(dateFrom, dateTo);
   

  }
  onRangeChanged(evt){
    console.log(evt);
  }

  

  ionViewDidLoad() {
    console.log('ionViewDidLoad MedicCalendarPage');
  }

}
