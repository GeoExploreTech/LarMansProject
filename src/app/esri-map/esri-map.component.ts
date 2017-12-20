import { Component, OnInit } from '@angular/core';
import { AppDataModelService } from '../app-data-model.service';
import { Router} from '@angular/router';


import * as esriLoader from 'esri-loader';

declare let $:any;

@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})
export class EsriMapComponent implements OnInit {

  isEsriMapOpens:boolean;

  constructor(
    private _isEsriMapOpen:AppDataModelService,
    private router:Router
  ) { }

  ngOnInit() {
    this._isEsriMapOpen.isEsriMapOpen.subscribe(res=> this.isEsriMapOpens = res);

    const options = {
      url: 'https://js.arcgis.com/4.6/'
    };
  
    // first, we use Dojo's loader to require the map class
    esriLoader.loadModules([
      "esri/Map",
      "esri/views/MapView",
      "esri/layers/FeatureLayer",
      "esri/layers/GraphicsLayer",
      "esri/geometry/geometryEngine",
      "esri/Graphic",

      "dojo/on",
      "dojo/dom",
      "dojo/dom-construct",
      "dojo/domReady!"
    ],options)
    .then(([
      Map, MapView,
      FeatureLayer,
      GraphicsLayer,
      geometryEngine,
      Graphic,
      on, dom, domConstruct
    ]) => {
      
      var map = new Map({
        basemap: "streets"
      });

      var view = new MapView({
        container: "mapId",
        map: map,
        zoom: 4,
        center: [15, 65] // longitude, latitude
      });


    })
    .catch(err => {
      // handle any errors
      console.error(err);
    });
  }


  openLayersDialog(){
    $("#infoDiv").dialog({
      title: "Estate Layers",
      autoOpen: false,
      modal: false,
      icon: "ui-icon-close",
      resizable: false,
      width: 260,
      position: {
          my: 'left top+50',
          at: 'left top+50',
          of: "#mapId"
      },
      collision: "fit flip"
    });
    $( ".widget-element" ).checkboxradio();
    $("#infoDiv").dialog("open");
  }

  sendMeHome(){
    this.router.navigate(['']);
  }



}
