import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {SERVER_URL} from '../config';
//import {Observable} from 'rxjs/Observable';
//import 'rxjs/add/operator/map';

const postData = {
          password:'',
          phone:''
       };

@Injectable()
export class AuthServiceProvider {

  constructor(public http: Http) {
    console.log('Hello AuthServiceProvider Provider');
    this.http = http;
  }

    sendResetCode(form) {

    
        return this.http.post(SERVER_URL + '/api/user/password/phone', form)
            .map(res => res.json())
            .toPromise();



    }
    resetPassword(form) {


        return this.http.post(SERVER_URL + '/api/user/password/reset', form)
            .map(res => res.json())
            .toPromise();



    }

  login(phone, password){
        postData.phone = phone
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
        form.email = (form.email) ? form.email : '' // para no enviar null
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

    getUser() {


        let headers = new Headers({
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + window.localStorage.getItem('token')
        }),

            options = new RequestOptions({ headers: headers });


        return this.http.get(SERVER_URL + '/api/account', options)
            .map(res => res.json())
            .toPromise();


    }

}
