import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/Rx';
import { SERVER_URL } from '../config';


@Injectable()
export class PatientServiceProvider {

    constructor(public http: Http) {
        console.log('Hello PatientServiceProvider Provider');
        this.http = http;
    }


    register(form) {

        let headers = new Headers({
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + window.localStorage.getItem('token')
        }),

            options = new RequestOptions({ headers: headers });



        return this.http.post(SERVER_URL + '/api/patient/register', form, options)
            .map(res => res.json())
            .toPromise();



    }
    savePressure(patient_id, form) {

        let headers = new Headers({
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + window.localStorage.getItem('token')
        }),

            options = new RequestOptions({ headers: headers });



        return this.http.post(SERVER_URL + '/api/account/patients/' + patient_id + '/pressures', form, options)
            .map(res => res.json())
            .toPromise();



    }
    getPressures(patient_id) {


        let headers = new Headers({
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + window.localStorage.getItem('token')
        }),

            options = new RequestOptions({ headers: headers });


        return this.http.get(SERVER_URL + '/api/account/patients/' + patient_id + '/pressures', options)
            .map(res => res.json())
            .toPromise();


    }
    deletePressure(id) {


        let headers = new Headers({
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + window.localStorage.getItem('token')
        }),

            options = new RequestOptions({ headers: headers });

        return this.http.delete(SERVER_URL + '/api/account/patients/pressures/' + id, options)
            .map(res => res.json())
            .toPromise();



    }
    saveSugar(patient_id, form) {

        let headers = new Headers({
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + window.localStorage.getItem('token')
        }),

            options = new RequestOptions({ headers: headers });



        return this.http.post(SERVER_URL + '/api/account/patients/' + patient_id + '/sugars', form, options)
            .map(res => res.json())
            .toPromise();



    }
    getSugars(patient_id) {


        let headers = new Headers({
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + window.localStorage.getItem('token')
        }),

            options = new RequestOptions({ headers: headers });


        return this.http.get(SERVER_URL + '/api/account/patients/' + patient_id + '/sugars', options)
            .map(res => res.json())
            .toPromise();


    }
    deleteSugar(id) {


        let headers = new Headers({
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + window.localStorage.getItem('token')
        }),

            options = new RequestOptions({ headers: headers });

        return this.http.delete(SERVER_URL + '/api/account/patients/sugars/' + id, options)
            .map(res => res.json())
            .toPromise();



    }
    saveMedicine(patient_id, form) {

        let headers = new Headers({
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + window.localStorage.getItem('token')
        }),

            options = new RequestOptions({ headers: headers });



        return this.http.post(SERVER_URL + '/api/account/patients/' + patient_id + '/medicines', form, options)
            .map(res => res.json())
            .toPromise();



    }
    getMedicines(patient_id) {


        let headers = new Headers({
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + window.localStorage.getItem('token')
        }),

            options = new RequestOptions({ headers: headers });


        return this.http.get(SERVER_URL + '/api/account/patients/' + patient_id + '/medicines', options)
            .map(res => res.json())
            .toPromise();


    }
    deleteMedicine(id) {


        let headers = new Headers({
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + window.localStorage.getItem('token')
        }),

            options = new RequestOptions({ headers: headers });

        return this.http.delete(SERVER_URL + '/api/account/patients/medicines/' + id, options)
            .map(res => res.json())
            .toPromise();



    }
    saveAllergy(patient_id, form) {

        let headers = new Headers({
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + window.localStorage.getItem('token')
        }),

            options = new RequestOptions({ headers: headers });



        return this.http.post(SERVER_URL + '/api/account/patients/' + patient_id + '/allergies', form, options)
            .map(res => res.json())
            .toPromise();



    }
    getAllergies(patient_id) {


        let headers = new Headers({
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + window.localStorage.getItem('token')
        }),

            options = new RequestOptions({ headers: headers });


        return this.http.get(SERVER_URL + '/api/account/patients/' + patient_id + '/allergies', options)
            .map(res => res.json())
            .toPromise();


    }
    deleteAllergy(id) {


        let headers = new Headers({
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + window.localStorage.getItem('token')
        }),

            options = new RequestOptions({ headers: headers });

        return this.http.delete(SERVER_URL + '/api/account/patients/allergies/' + id, options)
            .map(res => res.json())
            .toPromise();



    }

    getHistory(patient_id) {


        let headers = new Headers({
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + window.localStorage.getItem('token')
        }),

            options = new RequestOptions({ headers: headers });


        return this.http.get(SERVER_URL + '/api/account/patients/' + patient_id + '/history', options)
            .map(res => res.json())
            .toPromise();


    }
    update(patient_id, form) {


        let headers = new Headers({
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + window.localStorage.getItem('token')
        }),

            options = new RequestOptions({ headers: headers });

        return this.http.put(SERVER_URL + '/api/account/patients/' + patient_id, form, options)
            .map(res => res.json())
            .toPromise();



    }
    delete(patient_id) {


        let headers = new Headers({
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + window.localStorage.getItem('token')
        }),

            options = new RequestOptions({ headers: headers });

        return this.http.delete(SERVER_URL + '/api/account/patients/' + patient_id, options)
            .map(res => res.json())
            .toPromise();



    }

    firstByUser(id) {
        
        
                let headers = new Headers({
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + window.localStorage.getItem('token')
                }),
        
                    options = new RequestOptions({ headers: headers });
        
        
                return this.http.get(SERVER_URL + '/api/users/' + id + '/patients/first', options)
                    .map(res => res.json())
                    .toPromise();
        
        
            }

    findAllByUser(id) {


        let headers = new Headers({
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + window.localStorage.getItem('token')
        }),

            options = new RequestOptions({ headers: headers });


        return this.http.get(SERVER_URL + '/api/users/' + id + '/patients', options)
            .map(res => res.json())
            .toPromise();


    }

}
