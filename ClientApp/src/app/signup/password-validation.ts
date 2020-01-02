// import {AbstractControl} from '@angular/forms';
// export class PasswordValidation {

//     static MatchPassword(AC: AbstractControl) {
//        let password = AC.get('password').value; // to get value in input tag
//        let confirmPassword = AC.get('confirmPassword').value; // to get value in input tag
//         if (password !== confirmPassword) {
//             console.log('false');
//             AC.get('confirmPassword').setErrors( {MatchPassword: true} );
//         } else {
//             console.log('true');
//             return null;
//         }
//     }
// }

import { FormGroup } from '@angular/forms';
 
export class RegistrationValidator {
    static validate(registerForm: FormGroup) {
        let password = registerForm.controls.password.value;
        let repeatPassword = registerForm.controls.repeatPassword.value;
 
        if (repeatPassword.length <= 0) {
            return null;
        }
 
        if (repeatPassword !== password) {
            return {
                doesMatchPassword: true
            };
        }
 
        return null;
 
    }
}