import { AbstractControl } from '@angular/forms';

export class SearchValidator {
 

  static isNotEmpty(AC: AbstractControl) {
       debugger
       let password = AC.get('q').value; // to get value in input tag
       //let confirmPassword = AC.get('password_confirmation').value; // to get value in input tag
       // debugger
       /* if(password != confirmPassword) {
            console.log('false');
            AC.get('password_confirmation').setErrors( {MatchPassword: true} )
        } else {
            console.log('true');
            return null
        }*/
        console.log(password)
    }
 
}
// import { FormControl } from '@angular/forms';

// export class SearchValidator {

//    static isValid(control: FormControl): any {

//     console.log(control._parent.controls);
//        if(isNaN(control.value)){
//            return {
//                "not a number": true
//            };
//        }

//        if(control.value == '' && () ){
//            return {
//                "not a whole number": true
//            };
//        }

//        if(control.value < 18){
//            return {
//                "too young": true
//            };
//        }

//        if (control.value > 120){
//            return {
//                "not realistic": true
//            };
//        }

//        return null;
//    }

// }