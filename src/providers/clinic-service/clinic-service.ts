import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/Rx';
import {SERVER_URL} from '../config';


@Injectable()
export class ClinicServiceProvider {

  constructor(public http: Http) {
    console.log('Hello ClinicServiceProvider Provider');
    this.http = http;
  }

  
   
    findAll(search) {
        
          /*let params = {
            q: search,
             
          }*/
          let headers = new Headers({'Accept': 'application/json',
                   'Authorization': 'Bearer '+ window.localStorage.getItem('token')}),

              options = new RequestOptions({headers: headers,params: search});


        return this.http.get(SERVER_URL + '/api/clinics', options)
            .map(res => res.json())
            .toPromise();

       
    }
    findById(id) {
      
       
        let headers = new Headers({'Accept': 'application/json',
                 'Authorization': 'Bearer '+ window.localStorage.getItem('token')}),

            options = new RequestOptions({headers: headers});


      return this.http.get(SERVER_URL + '/api/clinics/'+ id, options)
          .map(res => res.json())
          .toPromise();

     
  }
  

}
