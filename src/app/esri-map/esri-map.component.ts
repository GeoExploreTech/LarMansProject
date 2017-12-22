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



    /**
   * DECLARING ESRI MODULES HERE
   */
  private map:any;
  private view: any;
  public Layer:any;
  public Collection:any;
  public Point:any;
  public PortalItem:any;
  public FeatureLayer:any;
  public Extent:any;
  public SpatialReference:any;
  public Polygon:any;
  public Graphic:any;

  public dom:any;
  public all:any;
  public on:any;

  private ESTATE:any;
  private PLOTS:any;
  private ENCROACHMENT:any;
  private BLOCKS:any;
  private ROAD_NETWORK:any;
  

  private resultsEstateLyr:any;
  private qTask4EstateLay :any;
  private infoDiv:any;
  private infoDivSelect:any;

  private estateLayName:any;

  private query_params:any;

  isEsriMapOpens:boolean;

  constructor(
    private _esriMapModule:AppDataModelService,
    private router:Router
  ) {
   
   }

  ngOnInit() {
    this._esriMapModule.isEsriMapOpen.subscribe(res=> this.isEsriMapOpens = res);
    $('.ui.floating.dropdown')
      .dropdown()
    ;
    
    const options = {
      url: 'https://js.arcgis.com/4.6/'
    };
  
    // first, we use Dojo's loader to require the map class
    esriLoader.loadModules([
      'esri/Map',
      'esri/views/MapView',
      "esri/layers/Layer",
      "esri/core/Collection",
      "esri/geometry/Point",
      "esri/portal/PortalItem",
      "esri/layers/FeatureLayer",
      "esri/geometry/Extent",
      "esri/geometry/SpatialReference",
      "esri/geometry/Polygon",
      "esri/Graphic",
      "esri/tasks/QueryTask",
      "esri/tasks/support/Query",
      "esri/layers/GraphicsLayer",

      "dojo/_base/array",
      "dojo/dom",
      "dojo/promise/all",
      "dojo/on",
      "dojo/domReady!"
    ],options)
    .then(([
      Map,
      MapView,
      Layer,
      Collection,
      Point,
      PortalItem,
      FeatureLayer,
      Extent,
      SpatialReference,
      Polygon,
      Graphic,
      QueryTask,
      Query,
      GraphicsLayer,

      arrayUtils,
      dom,
      all,
      on
    ]) => {

      
      this.dom = dom;
      this.all = all;
      this.on = on;

      this.infoDiv = document.getElementById('infoDiv');
      this.infoDivSelect = document.getElementById('infoDivSelect');
      
      
      // Create graphics layer and symbol to use for displaying the results from esate layer query
      this.resultsEstateLyr = new GraphicsLayer();


      // URL to feature service containing points representing the 50
      // most prominent peaks in the U.S.
      const estateUrl ="https://services8.arcgis.com/RqA65gdwUsw4IGhD/arcgis/rest/services/LAND_RECORD_MANAGEMENT_SYS/FeatureServer/4";

      this.ESTATE = new FeatureLayer({
        url: estateUrl,
        outFields: ["*"],
        visible: false
      });



       /*****************************************************************
       *  Point QueryTask to URL of feature service
       *****************************************************************/
      this.qTask4EstateLay = new QueryTask({
        url: estateUrl
      });

      /******************************************************************
       * Set the query parameters to always return geometry and all fields.
       * Returning geometry allows us to display results on the map/view
       ******************************************************************/
      this.query_params = new Query({
        returnGeometry: true,
        outFields: ["*"]
      });


      /*****************************************************************
       * Layers may be added to the map in the map's constructor
       *****************************************************************/
      this.map = new Map({
        basemap: "satellite",
        layers: [this.resultsEstateLyr,this.ESTATE]
      });


      /*****************************************************************
       * Or they may be added to the map using map.add()
       *****************************************************************/
      //map.add(transportationLyr);

      this.view = new MapView({
        container: "mapId",
        map: this.map
      });

      this.view.when(()=>{
        const query = this.ESTATE.createQuery();
        const estateRes = this.ESTATE.queryFeatures(query);
        estateRes.then(res=>{
          const estateName = this.getValues(res);
          this.estateLayName = this.getUniqueValues(estateName);
          this.generateLayerButton(this.estateLayName);
        });
       
      })






    }).catch(err => {
      // handle any errors
      console.error(err);
    });
    
  }

/**
 * Template for displaying Layers in the Map
 * @param id 
 */
  private template (id){
    let tem =  `
                <button class="item ui button" 
                style="
                margin-top: .3em;
                border-radius: 2.5rem;
                z-index: 500;

                "
                value="${id}"
                >${id}</button>
                `;

    return tem;
  }

  generateLayerButton(values){
    let docFrag = document.createDocumentFragment();
    values.forEach(res=>{
      const card = this.template(res);
      const elem = document.createElement("div");
      elem.innerHTML = card;
      this.on(elem, "click", ({target})=>{
        // console.log(target.value);
        this.doFieldQuery("NAME",target.value,this.resultsEstateLyr);

      });
      docFrag.appendChild(elem);

    });
    // Append the completed list to the page.
    this.infoDivSelect.appendChild(docFrag);
    docFrag = undefined;
  }



  openLayersDialog(){
    $("#infoDiv").dialog({
      title: "Estate Layers",
      autoOpen: false,
      modal: false,
      icon: "ui-icon-close",
      resizable: false,
      width: 280,
      height: 400,
      position: {
          my: 'left top+50',
          at: 'left top+50',
          of: "#mapId"
      },
      collision: "fit flip"
    });
    $("#infoDiv").dialog("open");
  }

  sendMeHome(){
    this.router.navigate(['']);
    // this.doQuery();
  }

/**
 * Attribute Query on a Specify Field in a FeatureLayer
 * @param field 
 * @param value 
 * @param graphicsLayer 
 */
  private doFieldQuery(field,value,graphicsLayer) {
    // Clear the results from a previous query
    graphicsLayer.removeAll();
    /*********************************************
     *
     * Set the where clause for the query. This can be any valid SQL expression.
     * In this case the inputs from the three drop down menus are used to build
     * the query. For example, if "Elevation", "is greater than", and "10,000 ft"
     * are selected, then the following SQL where clause is built here:
     *
     * params.where = "ELEV_ft > 10000";
     *
     * ELEV_ft is the field name for Elevation and is assigned to the value of the
     * select option in the HTML below. Other operators such as AND, OR, LIKE, etc
     * may also be used here.
     *
     **********************************************/
    this.query_params.where = field + '='+ value;
    this.qTask4EstateLay.execute(this.query_params)
    .then(res=>{
      console.log(res);
    })
    .otherwise(this.promiseRejected);



  }


  // Called each time the promise is rejected
  private promiseRejected(err) {
    console.error("Promise rejected: ", err.message);
  }


/**
 *  Method for getting unique value from a set of VALUE
 * @param values 
 */
  private getUniqueValues(values) {
    var uniqueValues = [];

    values.forEach(function(item) {
      if ((uniqueValues.length < 1 || uniqueValues.indexOf(item) ===
          -1) &&
        (item !== "")) {
          console.log(item);
          uniqueValues.push(item);
      }

    });
    return uniqueValues;
  }


/**
 * Method to get all the Value in a particular
 * Field.
 * @param response 
 */
  private getValues(response) {
    const features = response.features;
    const values = features.map(function(feature) {
      return feature.attributes.NAME;
    });
    //console.log(values);
    return values;
  }

  private createSideMenu(sidebar,title_tag) {
    $('#mapId').css({
      "background-color": "black",
      "padding": "2px",
      "margin-top": "2.5em",
      "width": "100vw",
      "height": "90vh",
      "position": "fixed",
      "left": "14.2vw",
      "border":" 0.2em solid #eee",
      "box-shadow": ".1em .1em .3em #eee", /* CSS3 ROUNDED CORNERS */
      "-moz-border-radius": "5px",
      "-webkit-border-radius": "5px",
      "-khtml-border-radius": "5px",
      "border-radius": "5px"
    });
    $('#mapId').width($('body').width()-185);
    $(sidebar).css({
      // "top": "54px",
      // "bottom": "0",
      // "left": "0",
      "z-index": 1200,
      "position": "relative",
      "padding": "1px",
      "overflow-x": "hidden",
      "overflow-y": "auto", /* Scrollable contents if viewport is shorter than content. */
      "border-right": ".4em solid #eee",
      "width": "20vw",
      "height": "100vh"
    });
    let icons = {
    header: "ui-icon-circle-arrow-e",
    activeHeader: "ui-icon-circle-arrow-s"
    };
    $( sidebar ).dialog({
      title: title_tag,
      width: "224.5px",
      draggable: false,
      position: {
         my: 'left top+32',
         at: 'left top+30',
         of: "body"
      },
      collision: "fit flip",
      resize: function( event, ui ) {
        $('#mapId').css({
          "left": ui.size.width,
          "width": "100vw"
        });
      },
      beforeClose: function( event, ui ) {
      
        $('#mapId').css({
          "left": 0,
          "width": "100vw"
        });
      }
    }).accordion({
      icons: icons,
      collapsible: true,
      heightStyle: "content"
    });


  }



}
