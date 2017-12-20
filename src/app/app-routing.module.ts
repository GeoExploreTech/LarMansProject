import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePageComponent } from './home-page/home-page.component';
import { SignUpPageComponent } from './sign-up-page/sign-up-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { EsriMapComponent } from './esri-map/esri-map.component';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent 
  },
  {
    path: 'application',
    component: EsriMapComponent
  },
  {
    path: 'signUp',
    component: SignUpPageComponent
  },
  {
    path: 'login',
    component: LoginPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
