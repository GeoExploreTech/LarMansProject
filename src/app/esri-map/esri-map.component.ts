import { Component, OnInit } from '@angular/core';
import { AppDataModelService } from '../app-data-model.service';

@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})
export class EsriMapComponent implements OnInit {

  isEsriMapOpens:boolean;

  constructor(private _isEsriMapOpen:AppDataModelService) { }

  ngOnInit() {
    this._isEsriMapOpen.isEsriMapOpen.subscribe(res=> this.isEsriMapOpens = res);
  }

}
