import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {SERVER_URL} from '../config';


@Injectable()
export class MedicServiceProvider {

  constructor(public http: Http) {
    console.log('Hello MedicServiceProvider Provider');
    this.http = http;
  }

  
   
    findAll(search) {
        
          /*let params = {
            q: search,
             
          }*/
          let headers = new Headers({'Accept': 'application/json',
                   'Authorization': 'Bearer '+ window.localStorage.getItem('token')}),

              options = new RequestOptions({headers: headers,params: search});


        return this.http.get(SERVER_URL + '/api/medics', options)
            .map(res => res.json())
            .toPromise();

       
    }
    findById(id) {
      
       
        let headers = new Headers({'Accept': 'application/json',
                 'Authorization': 'Bearer '+ window.localStorage.getItem('token')}),

            options = new RequestOptions({headers: headers});


      return this.http.get(SERVER_URL + '/api/medics/'+ id, options)
          .map(res => res.json())
          .toPromise();

     
  }
    findSchedules(medic_id, clinic_id,date_from,date_to) {

      //url: '/medics/'+ externalEvent.data('doctor') +'/schedules/list?office='+ externalEvent.data('office'),

         let params = {
            office: clinic_id,
            date1: date_from,
            date2: date_to
          }
          let headers = new Headers({'Accept': 'application/json',
                   'Authorization': 'Bearer '+ window.localStorage.getItem('token')}),

              options = new RequestOptions({headers: headers,params: params});


        return this.http.get(SERVER_URL + '/api/medics/'+ medic_id +'/schedules/list' , options)
            .map(res => res.json())
            .toPromise();

    }
    findAppointments(medic_id, clinic_id,date_from,date_to) {
      
          
      
               let params = {
                  office: clinic_id,
                  date1: date_from,
                  date2: date_to
                }
                let headers = new Headers({'Accept': 'application/json',
                         'Authorization': 'Bearer '+ window.localStorage.getItem('token')}),
      
                    options = new RequestOptions({headers: headers,params: params});
      
      
              return this.http.get(SERVER_URL + '/api/medics/'+ medic_id +'/appointments/list' , options)
                  .map(res => res.json())
                  .toPromise();
      
          }
    getSpecialities () {
     
      let headers = new Headers({'Accept': 'application/json',
               'Authorization': 'Bearer '+ window.localStorage.getItem('token')}),

          options = new RequestOptions({headers: headers});


    return this.http.get(SERVER_URL + '/api/medics/specialities' , options)
        .map(res => res.json())
        .toPromise();
    }

}
