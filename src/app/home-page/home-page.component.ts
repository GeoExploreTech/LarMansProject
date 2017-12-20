import { Component, OnInit } from '@angular/core';
import { AppDataModelService } from '../app-data-model.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  isEsriMapOpens:boolean;

  constructor(private _isEsriMapOpen:AppDataModelService) { 

  }

  ngOnInit() {
    this._isEsriMapOpen.isEsriMapOpen.subscribe(res=> this.isEsriMapOpens = res);
  }

}
