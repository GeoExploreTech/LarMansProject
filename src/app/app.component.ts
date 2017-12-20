import { AppDataModelService } from './app-data-model.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  isEsriMapOpens:boolean;

  constructor(private _isEsriMapOpen:AppDataModelService){

  }

  ngOnInit(){
    this._isEsriMapOpen.isEsriMapOpen.subscribe(res=> this.isEsriMapOpens = res);
    console.log(this.isEsriMapOpens);
  }

  openEsriMap(){
    this.isEsriMapOpens = true;
  }

}
