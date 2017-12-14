import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {SERVER_URL} from '../config';


@Injectable()
export class ReviewServiceProvider {

  constructor(public http: Http) {
    console.log('Hello ReviewServiceProvider Provider');
    this.http = http;
  }

    send(form){
      
      form.app = 'Cliente'
       
       let headers = new Headers({'Accept': 'application/json',
       'Authorization': 'Bearer '+ window.localStorage.getItem('token')}),

        options = new RequestOptions({headers: headers});
       
    
        
          return this.http.post(SERVER_URL + '/api/reviews', form, options)
          .map(res => res.json())
         .toPromise();

          
            
   }
   

}
