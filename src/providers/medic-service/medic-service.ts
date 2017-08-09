import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/Rx';
import {SERVER_URL} from '../config';


@Injectable()
export class MedicServiceProvider {

  constructor(public http: Http) {
    console.log('Hello MedicServiceProvider Provider');
    this.http = http;
  }

  
   
    findAll(search) {
        
          let params = {
            q: search
          }
          let headers = new Headers({'Accept': 'application/json',
                   'Authorization': 'Bearer '+ window.localStorage.getItem('token')}),

              options = new RequestOptions({headers: headers,params: params});


        return this.http.get(SERVER_URL + '/api/medics', options)
            .map(res => res.json())
            .toPromise();

       
    }

}
