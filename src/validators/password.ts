import { AbstractControl } from '@angular/forms';

export class PasswordValidator {
 
  /*static MatchPassword(control: FormControl) {
       debugger
       let password = control.get('password').value; // to get value in input tag
       let confirmPassword = '';//AC.get('password_confirmation').value; // to get value in input tag
        debugger
        if(password != confirmPassword) {
            console.log('false');
            //AC.get('password_confirmation').setErrors( {MatchPassword: true} )
        } else {
            console.log('true');
            return null
        }
    }*/
  static MatchPassword(AC: AbstractControl) {
       //debugger
       let password = AC.get('password').value; // to get value in input tag
       let confirmPassword = AC.get('password_confirmation').value; // to get value in input tag
       // debugger
        if(password != confirmPassword) {
            console.log('false');
            AC.get('password_confirmation').setErrors( {MatchPassword: true} )
        } else {
            console.log('true');
            return null
        }
    }
 
}