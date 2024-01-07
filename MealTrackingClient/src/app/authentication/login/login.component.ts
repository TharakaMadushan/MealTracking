import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from './../../shared/services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserForAuthenticationDto } from 'src/app/_Interfaces/user/userForAuthenticationDto.model';
import { AuthResponseDto } from 'src/app/_Interfaces/response/authResponseDto.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private returnUrl: string | undefined;

  loginForm!: FormGroup;
  errorMessage: string = '';
  showError: boolean | undefined;

  constructor(private authService: AuthenticationService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required])
    })
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  validateControl = (controlName: string) => {
    const control = this.loginForm.get(controlName);
    return control ? control.invalid && control.touched : false;
    //return this.loginForm.get(controlName).invalid && this.loginForm.get(controlName).touched
  }

  hasError = (controlName: string, errorName: string) => {
    const control = this.loginForm.get(controlName);
    return control ? control.hasError(errorName) : false;
    //return this.loginForm.get(controlName).hasError(errorName)
  }

  loginUser = (loginFormValue: any) => {
    this.showError = false;
    const login = {... loginFormValue };

    const userForAuth: UserForAuthenticationDto = {
      email: login.username,
      password: login.password
    }

    this.authService.loginUser('api/accounts/login', userForAuth)
    .subscribe({
      next: (res:AuthResponseDto) => {
       localStorage.setItem("token", res.token);
       this.authService.sendAuthStateChangeNotification(res.isAuthSuccessful);
       this.router.navigate([this.returnUrl]);
    },
    error: (err: HttpErrorResponse) => {
      this.errorMessage = err.message;
      this.showError = true;
    }})
  }
}
