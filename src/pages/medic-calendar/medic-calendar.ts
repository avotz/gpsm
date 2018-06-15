import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, ToastController } from 'ionic-angular';
import { MedicServiceProvider } from '../../providers/medic-service/medic-service';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
import { ModalReservationPage } from './modal-reservation';
import moment from 'moment'
@Component({
  selector: 'page-medic-calendar',
  templateUrl: 'medic-calendar.html',
})
export class MedicCalendarPage {

  params: any;
  calendar: any;
  eventSource: any[] = [];
  schedules: any[] = [];
  appointments: any[] = [];
  loader: any;
  authUser: any;
  currentDate: any;
  currentMonth: any = moment().month()
  currentYear: any = moment().year()
  self: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public medicService: MedicServiceProvider, public modalCtrl: ModalController, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public networkService: NetworkServiceProvider) {

    this.authUser = JSON.parse(window.localStorage.getItem('auth_user'));
    this.params = this.navParams.data;
    this.calendar = {
      currentDate: moment().toDate(),
      mode: 'month'
    }
    this.self = this;

    
    let dateFrom = moment(this.currentDate).startOf('month').format('YYYY-MM-DD');
    let dateTo = moment(this.currentDate).endOf('month').format('YYYY-MM-DD');
    this.loadAppointments(dateFrom, dateTo);

  }

  markDisabled(date) {
   

    var current = moment().format("YYYY-MM-DD");
    var dateCal = moment(date).format("YYYY-MM-DD");
    
  
      
    return moment(dateCal).isBefore(current)


   
  }

  loadAppointments(date_from, date_to) {
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else {
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
        .catch(error => {
          let message = 'Ha ocurrido un error cargando las consultas';

          let toast = this.toastCtrl.create({
            message: message,
            cssClass: 'mytoast error',
            duration: 3000
          });

          toast.present(toast);
          loader.dismiss();
        });
    }

  }

  loadSchedules(date_from, date_to, loader) {
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else {
      this.medicService.findSchedules(this.params.medic.id, this.params.clinic.id, date_from, date_to)
        .then(data => {
          this.schedules = data;
          let eventsOfMonth = [];
          data.forEach(schedule => {

            let intervals = this.createIntervalsFromHours(moment(schedule.start).format("YYYY-MM-DD"), moment(schedule.start).format("HH:mm"), moment(schedule.end).format("HH:mm"), moment.duration(schedule.user.settings.slotDuration).asMinutes());


            //let events = [];
            let title = 'Disponible';
            let startEvent;
            let endEvent;
            let reserved;
            let appointmentId;
            let reservedType;
            
            for (var i = 0; i < intervals.length-1; i++) {

              startEvent = moment(schedule.start).format("YYYY-MM-DD") + 'T' + intervals[i] + ':00';
              endEvent = moment(schedule.start).format("YYYY-MM-DD") + 'T' + intervals[i + 1] + ':00';
              reservedType = this.isReserved(startEvent, endEvent);
              if (reservedType.res) {
                if (reservedType.res == 1) {
                  title = 'No Disponible';
                  reserved = 1;
                }
                else {
                  title = 'Reservado';
                  reserved = 2;
                  appointmentId = reservedType.id
                }

              } else {
                title = 'Disponible';
                reserved = 0;
              }

              let event = {
                title: title,
                startTime: moment(moment(schedule.start).format("YYYY-MM-DD") + ' ' + intervals[i]).toDate(),
                endTime: moment(moment(schedule.start).format("YYYY-MM-DD") + ' ' + intervals[i + 1]).toDate(),
                startFormatted: moment(schedule.start).format("YYYY-MM-DD") + ' ' + intervals[i] + ':00',
                endFormatted: moment(schedule.start).format("YYYY-MM-DD") + ' ' + intervals[i + 1] + ':00',
                start: startEvent,
                end: endEvent,
                allDay: false,
                reserved: reserved,
                office_id: this.params.clinic.id,
                medic_id: this.params.medic.id,
                office: this.params.clinic,
                medic: this.params.medic,
                delete_id: appointmentId

              }

              eventsOfMonth.push(event);

            }
           


          });
          
          this.eventSource = eventsOfMonth;
          
          loader.dismiss();

        })
        .catch(error => {
          let message = 'Ha ocurrido un error cargando los horarios';

          let toast = this.toastCtrl.create({
            message: message,
            cssClass: 'mytoast error',
            duration: 3000
          });

          toast.present(toast);
          loader.dismiss();
        });
    }

  }
  // isAvailable(date) {
  //   let res = false;

  //   for (var j = 0; j < this.schedules.length; j++) {

  //     if (moment(this.schedules[j].date).format("YYYY-MM-DD") == date ) {

  //       res = true;
  //     }

  //   }

  //   return res

  // }

  isReserved(startSchedule, endSchedule) {
    let res = {
       res: 0,
       id: 0
    };

    for (var j = 0; j < this.appointments.length; j++) {

      if (this.appointments[j].end > startSchedule && this.appointments[j].start < endSchedule) {

        if (this.appointments[j].created_by == this.authUser.id){ //si fue el usuario logueado que creo la cita cambia el titulo a reservado
          res.res = 2
          res.id = this.appointments[j].id
           
        }else{ /// se pone titulo en no disponible
    
          res.res = 1
          res.id = this.appointments[j].id
        }
      }

    }

    return res

  }

  createIntervalsFromHours(date, from, until, slot) {

    until = moment(date + " " + until).toDate()//Date.parse(date + " " + until);
    from = moment(date + " " + from).toDate()//Date.parse(date + " " + from);

    let intervalLength = (slot) ? slot : 30;
    let intervalsPerHour = 60 / intervalLength;
    let milisecsPerHour = 60 * 60 * 1000;

    let max = (Math.abs(until - from) / milisecsPerHour) * intervalsPerHour;

    let time = from;//new Date(from);
    let intervals = [];
    for (let i = 0; i <= max; i++) {
      //doubleZeros just adds a zero in front of the value if it's smaller than 10.
      let hour = this.doubleZeros(time.getHours());
      let minute = this.doubleZeros(time.getMinutes());
      intervals.push(hour + ":" + minute);
      time.setMinutes(time.getMinutes() + intervalLength);
    }
    return intervals;
  }


  doubleZeros(item) {

    return (item < 10) ? '0' + item : item;
  }

  onEventSelected(evt) {
    console.log(evt)
    if (evt.reserved == 1) return

    let current = moment().toDate();

    if (evt.startTime < current && (evt.reserved == 1 || evt.reserved == 0)) {
      let toast = this.toastCtrl.create({
        message: 'No se puede reservar en horas pasadas',
        cssClass: 'mytoast error',
        duration: 3000
      });
      toast.present(toast);
      return
    }

    if (evt.reserved == 2)
      evt.show = 1;

    let modal = this.modalCtrl.create(ModalReservationPage, evt);
    modal.onDidDismiss(data => {

      if (data.date){
        this.calendar.currentDate = moment(data.date).toDate();//new Date(data.date);
        let dateFrom = moment(data.date).startOf('month').format('YYYY-MM-DD');
        let dateTo = moment(data.date).endOf('month').format('YYYY-MM-DD');
        //this.calendar.currentDate = moment(data.date)

        this.currentMonth = moment(data.date).month()
        this.currentYear = moment(data.date).year()
        this.loadAppointments(dateFrom, dateTo);
      }
     

      if(data.toHome)
        this.goHome()

    });
    modal.present();
  }
  

  onCurrentDateChanged(date) {

    // let dateFrom = moment(date).format('YYYY-MM-DD');
    // let dateTo = dateFrom; //moment(lastDay).format('YYYY-MM-DD');
    // this.currentDate = dateFrom;
    let dateFrom = moment(date).startOf('month').format('YYYY-MM-DD');
    let dateTo = moment(date).endOf('month').format('YYYY-MM-DD');
    this.currentDate = moment(date).format('YYYY-MM-DD');

    console.log(dateFrom + ' - ' + dateTo)
    if (this.currentMonth != moment(date).month() || this.currentYear != moment(date).year()) {

      this.currentMonth = moment(date).month()
      this.currentYear = moment(date).year()
      this.loadAppointments(dateFrom, dateTo);
    

    }
     


  }
  goHome(){
    this.navCtrl.popToRoot()
  }


}
