
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentUrlService } from './environment-url.service';
import { UserForRegistrationDto } from 'src/app/_Interfaces/user/userForRegistrationDto.model';
import { RegistrationResponseDto } from 'src/app/_Interfaces/response/userForRegistrationDto.model';
import { UserForAuthenticationDto } from 'src/app/_Interfaces/user/userForAuthenticationDto.model';
import { AuthResponseDto } from 'src/app/_Interfaces/response/authResponseDto.model';
import { Subject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ForgotPasswordDto } from 'src/app/_Interfaces/resetPassword/forgotPasswordDto.model';
import { ResetPasswordDto } from 'src/app/_Interfaces/resetPassword/resetPasswordDto.model';
import { CustomEncoder } from '../custom-encoder';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private authChangeSub = new Subject<boolean>()
  public authChanged = this.authChangeSub.asObservable();

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService, private jwtHelper: JwtHelperService) { }

  public registerUser = (route: string, body: UserForRegistrationDto) => {
    return this.http.post<RegistrationResponseDto> (this.createCompleteRoute(route, this.envUrl.urlAddress), body);
  }

  public sendAuthStateChangeNotification = (isAuthenticated: boolean) => {
    this.authChangeSub.next(isAuthenticated);
  }

  public isUserAuthenticated = (): boolean => {
    const token = localStorage.getItem("token");
    if (token) {
      return !this.jwtHelper.isTokenExpired(token);
    }
    return false;
  }

  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}/${route}`;
  }

  public loginUser = (route: string, body: UserForAuthenticationDto) => {
    return this.http.post<AuthResponseDto>(this.createCompleteRoute(route, this.envUrl.urlAddress), body);
  }

  public logout = () => {
    localStorage.removeItem("token");
    this.sendAuthStateChangeNotification(false);
  }

  public isUserAdmin = (): boolean => {
    const token = localStorage.getItem("token");
    const decodedToken = this.jwtHelper.decodeToken(token!);
    const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']

    return role === 'Administrator';
  }

  public forgotPassword = (route: string, body: ForgotPasswordDto) => {
    return this.http.post(this.createCompleteRoute(route, this.envUrl.urlAddress), body);
  }

  public resetPassword = (route: string, body: ResetPasswordDto) => {
    return this.http.post(this.createCompleteRoute(route, this.envUrl.urlAddress), body);
  }

  public confirmEmail = (route: string, token: string, email: string) => {
    let params = new HttpParams({ encoder: new CustomEncoder() })
    params = params.append('token', token);
    params = params.append('email', email);
    return this.http.get(this.createCompleteRoute(route, this.envUrl.urlAddress), { params: params });
  }
}
