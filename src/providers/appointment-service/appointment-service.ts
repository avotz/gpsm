import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/Rx';
import {SERVER_URL} from '../config';


@Injectable()
export class AppointmentServiceProvider {

  constructor(public http: Http) {
    console.log('Hello AppointmentServiceProvider Provider');
    this.http = http;
  }

  
   save(appointment){
       
        let headers = new Headers({'Accept': 'application/json',
                   'Authorization': 'Bearer '+ window.localStorage.getItem('token')}),

              options = new RequestOptions({headers: headers});

       
      
        return this.http.post(SERVER_URL + '/api/appointments', appointment, options)
            .map(res => res.json())
           .toPromise();

           
             
    }
  saveReminder(appointment_id, time){
      
    let params = {
        reminder_time: time
   
      }

       let headers = new Headers({'Accept': 'application/json',
                  'Authorization': 'Bearer '+ window.localStorage.getItem('token')}),

             options = new RequestOptions({headers: headers});

      
     
       return this.http.post(SERVER_URL + '/api/appointments/'+ appointment_id +'/reminder', params, options)
           .map(res => res.json())
          .toPromise();

          
            
   }
   delete(appointment_id){
    
   
     let headers = new Headers({'Accept': 'application/json',
     'Authorization': 'Bearer '+ window.localStorage.getItem('token')}),

      options = new RequestOptions({headers: headers});
     
     return this.http.delete(SERVER_URL + '/api/appointments/'+ appointment_id +'/delete', options)
         .map(res => res.json())
        .toPromise();

        
          
 }
   findById(id) {
    
     
      let headers = new Headers({'Accept': 'application/json',
               'Authorization': 'Bearer '+ window.localStorage.getItem('token')}),

          options = new RequestOptions({headers: headers});


    return this.http.get(SERVER_URL + '/api/appointments/'+ id, options)
        .map(res => res.json())
        .toPromise();

   
}
    findAllByUser(id) {
        
    
          let headers = new Headers({'Accept': 'application/json',
                   'Authorization': 'Bearer '+ window.localStorage.getItem('token')}),

              options = new RequestOptions({headers: headers});


        return this.http.get(SERVER_URL + '/api/users/'+ id +'/appointments', options)
            .map(res => res.json())
            .toPromise();

       
    }
    getAppointments() {
      
      
          let headers = new Headers({
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + window.localStorage.getItem('token')
          }),
  
              options = new RequestOptions({ headers: headers });
  
  
          return this.http.get(SERVER_URL + '/api/appointments', options)
              .map(res => res.json())
              .toPromise();
  
  
      }

}
