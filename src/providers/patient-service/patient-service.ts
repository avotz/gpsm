import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/Rx';
import {SERVER_URL} from '../config';


const postData = {
          password:'',
          email:''
       };

@Injectable()
export class PatientServiceProvider {

  constructor(public http: Http) {
    console.log('Hello PatientServiceProvider Provider');
    this.http = http;
  }

  
   register(form){
       
        let headers = new Headers({'Accept': 'application/json',
                   'Authorization': 'Bearer '+ window.localStorage.getItem('token')}),

              options = new RequestOptions({headers: headers});

       
      
        return this.http.post(SERVER_URL + '/api/patient/register', form, options)
            .map(res => res.json())
           .toPromise();

           
             
    }
    findAll() {
        
      
          let headers = new Headers({'Accept': 'application/json',
                   'Authorization': 'Bearer '+ window.localStorage.getItem('token')}),

              options = new RequestOptions({headers: headers});


        return this.http.get(SERVER_URL + '/api/user/', options)
            .map(res => res.json())
            .toPromise();

       
    }

}
