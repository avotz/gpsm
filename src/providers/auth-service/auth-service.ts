import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/Rx';
import {SERVER_URL} from '../config';
//import {Observable} from 'rxjs/Observable';
//import 'rxjs/add/operator/map';

const postData = {
          password:'',
          email:''
       };

@Injectable()
export class AuthServiceProvider {

  constructor(public http: Http) {
    console.log('Hello AuthServiceProvider Provider');
    this.http = http;
  }

  login(email, password){
        postData.email = email
        postData.password = password
       
        return this.http.post(SERVER_URL + '/api/token', postData)
            .map(res => res.json())
            .toPromise();

           
             
    }
    registerSocial(name, email, access_token){
        let postDataRegister = {
          name: name,
          email:email,
          api_token: access_token,
          push_token : window.localStorage.getItem('push_token')  
        }
        
        return this.http.post(SERVER_URL + '/api/user/social/register', postDataRegister)
            .map(res => res.json())
           .toPromise();

           
             
    }
    register(form){
       
        form.push_token = window.localStorage.getItem('push_token') 
        /*let postDataRegister = {
          name: form.name,
          email: form.email,
          password: form.password,
          password_confirmation: form.password_confirmation
        }*/
        
        return this.http.post(SERVER_URL + '/api/user/register', form)
            .map(res => res.json())
           .toPromise();

           
             
    }
    update(form){
      
       form.push_token = window.localStorage.getItem('push_token') 
       
       let headers = new Headers({'Accept': 'application/json',
       'Authorization': 'Bearer '+ window.localStorage.getItem('token')}),

        options = new RequestOptions({headers: headers});
       
       return this.http.put(SERVER_URL + '/api/account/edit', form, options)
           .map(res => res.json())
          .toPromise();

          
            
   }
   updatePushToken(token){
    
   
     let headers = new Headers({'Accept': 'application/json',
     'Authorization': 'Bearer '+ window.localStorage.getItem('token')}),

      options = new RequestOptions({headers: headers});
     
     return this.http.put(SERVER_URL + '/api/account/updatepush', token, options)
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
