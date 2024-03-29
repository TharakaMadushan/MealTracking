import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './../../shared/services/authentication.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserForRegistrationDto } from 'src/app/_Interfaces/user/userForRegistrationDto.model';
import { PasswordConfirmationValidatorService } from 'src/app/shared/custom-validators/password-confirmation-validator.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css'],
})
export class RegisterUserComponent implements OnInit {
  registerForm!: FormGroup;
  public errorMessage: string = '';
  public showError: boolean | undefined;

  constructor(private authService: AuthenticationService, private passConfValidator: PasswordConfirmationValidatorService,
    private router: Router) { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirm: new FormControl(''),
    });

    this.registerForm
      .get('confirm')
      ?.addValidators([
        Validators.required,
        this.passConfValidator.validateConfirmPassword(
          this.registerForm.get('password')!
        ),
      ]);
  }

  // public validateControl = (controlName: string) => {
  //   return this.registerForm.get(controlName).invalid && this.registerForm.get(controlName).touched
  // }

  // public hasError = (controlName: string, errorName: string) => {
  //   return this.registerForm.get(controlName).hasError(errorName)
  // }

  public validateControl = (controlName: string) => {
    const control = this.registerForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  };

  public hasError = (controlName: string, errorName: string) => {
    const control = this.registerForm.get(controlName);
    return control ? control.hasError(errorName) : false;
  };

  public registerUser = (registerFormValue: any) => {
    this.showError = false;
    const formValues = { ...registerFormValue };

    const user: UserForRegistrationDto = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      password: formValues.password,
      confirmPassword: formValues.confirm,
      clientURI: 'http://localhost:4200/authentication/emailconfirmation'
    };

    this.authService.registerUser('api/accounts/registration', user).subscribe({
      next: (_) => this.router.navigate(["/authentication/login"]),
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.message;
        this.showError = true;
      },
    });
  };
}
