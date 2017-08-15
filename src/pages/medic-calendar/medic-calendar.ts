import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MedicServiceProvider } from '../../providers/medic-service/medic-service';
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
  constructor(public navCtrl: NavController, public navParams: NavParams, public medicService: MedicServiceProvider) {
      this.params = this.navParams.data;
      this.medicService = medicService;
      this.calendar = {
        currentDate:new Date(),
        mode: 'month'
      }

     // this.loadEvents();
     

    
  }
  loadSchedules (date_from, date_to) {
    this.medicService.findSchedules(this.params.medic_id, this.params.clinic_id, date_from, date_to)
    .then(data => {
        console.log(data)
        //this.schedules = data.data;
        data.forEach(schedule => {
          console.log(schedule.start)
          let intervals = this.createIntervalsFromHours(moment(schedule.start).format("YYYY-MM-DD"), moment(schedule.start).format("HH:mm"), moment(schedule.end).format("HH:mm"), this.params.slot_duration);

          console.log(intervals);
          let events = [];
          for (var i = 0; i < intervals.length; i++) {
            
          
            
            let event = {
                title: 'Disponible',
                startTime: new Date(moment(schedule.start).format("YYYY-MM-DD") +' '+ intervals[i]),
                endTime: new Date(moment(schedule.start).format("YYYY-MM-DD") +' '+ intervals[i+1]),
                allDay: false
            }

            events.push(event);
            
          }

          this.eventSource = events;
          
        
        });
        
    })
    .catch(error => alert(JSON.stringify(error)));

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

loadEvents() {
      this.eventSource.push({
          title: 'test',
          startTime: new Date('2017-08-09 14:00:00'),
          endTime: new Date('2017-08-09 14:30:00'),
          allDay: false
      });
      this.eventSource.push({
          title: 'test2',
          startTime: new Date('2017-08-09 17:00:00'),
          endTime: new Date('2017-08-09 17:30:00'),
          allDay: false
      });
      //this.myCalendar.loadEvents();
  }
  onEventSelected (evt){
    console.log(evt)
  }
  onViewTitleChanged (evt){

  }
  onTimeSelected (evt){
   // console.log(evt.selectedTime)
  }
  onCurrentDateChanged(date){
    //console.log('current date change - '+ evt)
    //let currentDate = date;
    //let firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    //let lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
    let dateFrom = moment(date).format('YYYY-MM-DD');
    let dateTo = dateFrom; //moment(lastDay).format('YYYY-MM-DD');

    console.log(dateFrom +' - '+ dateTo)
     this.loadSchedules(dateFrom, dateTo);

  }
  onRangeChanged(evt){
    console.log(evt);
  }

  

  ionViewDidLoad() {
    console.log('ionViewDidLoad MedicCalendarPage');
  }

}
