import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CompaniesComponent } from './company/companies/companies/companies.component';
import { NotFoundComponent } from './error-pages/not-found/not-found/not-found.component';
import { HomeComponent } from './home/home/home.component';
import { MenuComponent } from './menu/menu/menu.component';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandlerService } from './shared/services/error-handler.service';
import { JwtModule } from "@auth0/angular-jwt";
import { AuthGuard } from './shared/guards/auth.guard';
import { PrivacyComponent } from './privacy/privacy.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { AdminGuard } from './shared/guards/admin.guard';

export function tokenGetter() {
  return localStorage.getItem("token");
}
@NgModule({
  declarations: [AppComponent, NotFoundComponent, HomeComponent, MenuComponent, PrivacyComponent, ForbiddenComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: 'home', component: HomeComponent },
      { path: 'company', loadChildren: () => import('./company/company.module').then(m => m.CompanyModule), canActivate: [AuthGuard] },
      {
        path: 'authentication',
        loadChildren: () =>
          import('./authentication/authentication.module').then(
            (m) => m.AuthenticationModule
          ),
      },
      { path: 'privacy', component: PrivacyComponent, canActivate: [AuthGuard, AdminGuard] },
      { path: '404', component: NotFoundComponent },
      { path: 'forbidden', component: ForbiddenComponent },
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: '**', redirectTo: '/404', pathMatch: 'full' },
    ]),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:5001"],
        disallowedRoutes: []
      }
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorHandlerService, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
