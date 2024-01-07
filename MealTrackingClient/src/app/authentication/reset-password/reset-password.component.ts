
import { ActivatedRoute } from '@angular/router';
import { PasswordConfirmationValidatorService } from './../../shared/custom-validators/password-confirmation-validator.service';
import { AuthenticationService } from './../../shared/services/authentication.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ResetPasswordDto } from 'src/app/_Interfaces/resetPassword/resetPasswordDto.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm!: FormGroup;
  showSuccess!: boolean;
  showError!: boolean;
  errorMessage!: string;

  private token!: string;
  private email!: string;

  constructor(private authService: AuthenticationService, private passConfValidator: PasswordConfirmationValidatorService,
    private route: ActivatedRoute) { }

    ngOnInit(): void {
      this.resetPasswordForm = new FormGroup({
        password: new FormControl('', [Validators.required]),
        confirm: new FormControl('')
    });

    this.resetPasswordForm.get('confirm')?.addValidators([Validators.required,
      this.passConfValidator.validateConfirmPassword(this.resetPasswordForm.get('password')!)]);

      this.token = this.route.snapshot.queryParams['token'];
      this.email = this.route.snapshot.queryParams['email'];
  }

  public validateControl = (controlName: string) => {
    const control = this.resetPasswordForm.get(controlName);
    return control ? control.invalid && control.touched : false;
    //return this.resetPasswordForm.get(controlName).invalid && this.resetPasswordForm.get(controlName).touched
  }

  public hasError = (controlName: string, errorName: string) => {
    const control = this.resetPasswordForm.get(controlName);
    return control ? control.hasError(errorName) : false;
    //return this.resetPasswordForm.get(controlName).hasError(errorName)
  }

  public resetPassword = (resetPasswordFormValue: any) => {
    this.showError = this.showSuccess = false;
    const resetPass = { ... resetPasswordFormValue };

    const resetPassDto: ResetPasswordDto = {
      password: resetPass.password,
      confirmPassword: resetPass.confirm,
      token: this.token,
      email: this.email
    }

    this.authService.resetPassword('api/accounts/resetpassword', resetPassDto)
    .subscribe({
      next:(_) => this.showSuccess = true,
    error: (err: HttpErrorResponse) => {
      this.showError = true;
      this.errorMessage = err.message;
    }})
  }
}
