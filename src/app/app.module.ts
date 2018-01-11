import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { SignUpPageComponent } from './sign-up-page/sign-up-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { EsriMapComponent } from './esri-map/esri-map.component';
import { AppDataModelService } from './app-data-model.service';
import { ProjectionModel } from './modelAlgorithm/projection';
import { PdfReporter } from './modelAlgorithm/pdfReporter'


@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    SignUpPageComponent,
    LoginPageComponent,
    EsriMapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    AppDataModelService,
    ProjectionModel,
    PdfReporter
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
