import { Component, OnInit } from '@angular/core';
import { AppDataModelService } from '../app-data-model.service';
import { Router} from '@angular/router';

import { ProjectionModel} from '../modelAlgorithm/projection'


import * as esriLoader from 'esri-loader';
import { forEach } from '@angular/router/src/utils/collection';


declare let $:any;
declare let proj4:any;
declare let turf:any;

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
  private Layer:any;
  private Collection:any;
  private Point:any;
  private webMer;
  private PortalItem:any;
  private FeatureLayer:any;
  private Extent:any;
  private SpatialReference:any;
  private Polygon:any;
  private Graphic:any;
  private query_params4plot:any;
  private Query:any;
  private QueryTask: any;
  private arrayUtils:any;

  private dom:any;
  private all:any;
  private on:any;

  private ESTATE:any;
  private PLOTS:any;
  private ENCROACHMENT:any;
  private BLOCKS:any;
  private ROAD_NETWORK:any;


  private plotUrl:string;
  

  private resultsEstateLyr:any;
  private result4PlotQuery:any;
  private qTask4EstateLay :any;
  private qTask4PlotLay: any;


  private infoDiv:any;
  private infoDivSelect:any;

  private estateLayName:any;

  private query_params:any;

  // Variable for storing inputed geometry
  private result4PolygonSearch: any; 

  isEsriMapOpens:boolean;

  constructor(
    private _esriMapModule:AppDataModelService,
    private router:Router,
    private _projM: ProjectionModel
  ) {
  //  this._projM = new ProjectionModel();

   }

  ngOnInit() {
    this._esriMapModule.isEsriMapOpen.subscribe(res=> this.isEsriMapOpens = res);
    $('.ui.floating.dropdown')
      .dropdown();
    $('.ui.accordion')
      .accordion()
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
      "esri/geometry/support/webMercatorUtils",

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
      webMercatorUtils,

      arrayUtils,
      dom,
      all,
      on
    ]) => {

      
      this.dom = dom;
      this.all = all;
      this.on = on;
      this.Graphic = Graphic;
      this.FeatureLayer = FeatureLayer;
      this.webMer = webMercatorUtils;
      this.Query = Query;
      this.QueryTask = QueryTask;
      this.SpatialReference = SpatialReference;
      this.arrayUtils = arrayUtils;

      this.infoDiv = document.getElementById('infoDiv');
      this.infoDivSelect = document.getElementById('infoDivSelect');
      
      
      // Create graphics layer and symbol to use for displaying the results from esate layer query
      this.resultsEstateLyr = new GraphicsLayer();
      this.result4PlotQuery = new GraphicsLayer();


      // URL to feature service containing points representing the 50
      // most prominent peaks in the U.S.
      const estateUrl ="https://services8.arcgis.com/RqA65gdwUsw4IGhD/arcgis/rest/services/LAND_RECORD_MANAGEMENT_SYS/FeatureServer/4";
      this.plotUrl = "https://services8.arcgis.com/RqA65gdwUsw4IGhD/arcgis/rest/services/LAND_RECORD_MANAGEMENT_SYS/FeatureServer/3";

      this.ESTATE = new FeatureLayer({
        url: estateUrl,
        outFields: ["*"],
        visible: false
      });

      this.ROAD_NETWORK = new FeatureLayer({
        url: "https://services8.arcgis.com/RqA65gdwUsw4IGhD/arcgis/rest/services/LAND_RECORD_MANAGEMENT_SYS/FeatureServer/1",
        outFields: ["*"],
        visible: false

      });

      this.ENCROACHMENT = new FeatureLayer({
        url: "https://services8.arcgis.com/RqA65gdwUsw4IGhD/arcgis/rest/services/LAND_RECORD_MANAGEMENT_SYS/FeatureServer/2",
        outFields: ["*"],
        visible: true
      });

      this.PLOTS = new FeatureLayer({
        url: this.plotUrl,
        outFields: ["*"],
        //renderer: plotRenderer,
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
        layers: [this.resultsEstateLyr, this.result4PlotQuery, this.ESTATE, this.PLOTS, this.ENCROACHMENT, this.ROAD_NETWORK]
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


       
      }, function (error) {
        // This function will execute if the promise is rejected due to an error
        console.log(error);
      });


    }).catch(err => {
      // handle any errors
      console.error(err);
    });
    
  } // end of ngOnInit





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
    this.query_params.where = `${field} = \'${value}\'`;
    console.log(this.query_params.where);
    this.qTask4EstateLay.execute(this.query_params)
    .then(res=>{
      const layQuery = this.polygonLayFromFeatureLay(res, true, [237, 187, 153, 0.8]);
      graphicsLayer.addMany(layQuery);
      this.view.goTo(layQuery[0].geometry.extent);

      // this._projM.transformProj(['EPSG:26331'], 'inverse', res.features[0].geometry.rings[0]);
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
      width: "190px",
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
    });


  }

  private polygonLayFromFeatureLay(feature, toTransform:boolean, color:Array<Number>){
    const polygonGraphic = [];
    feature.features.forEach(item=>{
      console.log(item);
      let ring;
      if (toTransform) {
        ring = this._projM.transformArray2_Minna31(item.geometry.rings[0]);
      } else {
        ring = item.geometry.rings[0];
      }

      // Add the geometry and symbol to a new graphic
      polygonGraphic.push(
        new this.Graphic({
          geometry: {
            type: "polygon",
            rings: ring,
            spatialReference: { wkid: 4326 }
          },
          symbol: {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            color: color, //112, 185, 246, 0.8
            outline: { // autocasts as new SimpleLineSymbol()
              color: [248, 233, 8],
              width: 1
            }
          },
          // select only the attributes you care about
          attributes: item.attributes

        })
      );
    }
   );


    return polygonGraphic;
  }


  private openPolygonSearchDialog(){
    $("#polygonSearchTable").dialog({
      title: "Percel Charting",
      autoOpen: false,
      modal: false,
      icon: "ui-icon-close",
      resizable: true,
      width: 600,
      height: 500,
      position: {
        my: 'left top+50',
        at: 'left top+50',
        of: "#mapId"
      },
      collision: "fit flip",
      resize: (event, ui) => {
        $("#polygonSearchTable").css({
          "margin": "0"
        });
      }
    });

    this.polygonSearchTableModel();

  }




  private polygonSearchTableModel(){
    $("#polygonSearchTable").dialog("open");

    const $TABLE = $('#polygonSearchTable');
    const $BTN = $('#search-btn');

    $('.table-add').click(function () {
      let $clone = $TABLE.find('tr.hide').clone(true).removeClass('hide table-line');
      $TABLE.find('table').append($clone);
    });

    $('.table-remove').click(function () {
      $(this).parents('tr').detach();
    });

    $('.table-up').click(function () {
      let $row = $(this).parents('tr');
      if ($row.index() === 1) return; // Don't go above the header
      $row.prev().before($row.get(0));
    });

    $('.table-down').click(function () {
      let $row = $(this).parents('tr');
      $row.next().after($row.get(0));
    });

    // A few jQuery helpers for exporting only
    $.fn.pop = [].pop;
    $.fn.shift = [].shift;

    this.on($BTN, "click",()=>
      {

        const resultID = [];
        const resultData = [];
        //PLOTS.visible = false;
        let $rows = $TABLE.find('tr:not(:hidden)');
        let headers = [];
        const data = [];

        // Get the headers (add special header logic here)
        $($rows.shift()).find('th:not(:empty)').each(function () {
          headers.push($(this).text().toLowerCase());
        });

        // Turn all existing rows into a loopable array
        $rows.each(function () {
          let $td = $(this).find('td');
          let h = {};

          // Use the headers from earlier to name our hash keys
          headers.forEach(function (header, i) {
            h[header] = $td.eq(i).text();
          });

          data.push(h);
        });

        data.forEach(item => {
          const pb = item.stn_id;
          const x = Number(item.easting);
          const y = Number(item.northing);
          resultID.push(pb);

          resultData.push(proj4('EPSG:26331').inverse([x, y]));
        });

      this.result4PolygonSearch = [resultID, resultData];
      this.view.graphics.removeAll();
      const laypoint = this.createPointGraphics(this.result4PolygonSearch[1], this.result4PolygonSearch[0]);
      const polygon2search = this.create_polygon(laypoint);
      this.view.graphics.add(polygon2search);
      
      

      const polygonGeometry = {
        type: "polygon",
        rings: resultData,
        spatialReference: { wkid: 4326 }
      }



      this.query_params4plot = new this.Query({
        geometry: polygonGeometry,
        spatialRelationship: "intersects",
        returnGeometry: true,
        outFields: ["*"]
      });

      this.qTask4PlotLay = new this.QueryTask({
        url: this.plotUrl
      });

      this.qTask4PlotLay.execute(this.query_params4plot).then(result => {

        const layQuery = this.polygonLayFromFeatureLay(result, false, [58, 93, 209, 0.7]);
        
        this.resultsEstateLyr.addMany(layQuery);
        this.view.goTo(layQuery[0].geometry.extent);

        layQuery.forEach(res =>{
          console.log(turf.polygon(resultData));
          // this.computeInterceptArea(turf.polygon(resultData),res)
        });
        
      }
    ); // End of query task for polygon search


      }
    );
    
  }

  private computeInterceptArea(poly1,poly2){
    const feature1 = turf.polygon(poly1.geometry.rings[0]);
    const feature2 = turf.polygon(poly2.geometry.rings[0]);
    var intersection = turf.intersect(feature1, feature2);

    console.log(intersection);
  }


  private projLayer2WebMer(feature){
    const projFeatures = [];
    feature.features.forEach(item=>{
      if (this.webMer.canProject(item.geometry, this.SpatialReference .WebMercator)) {
        
        projFeatures.push(this.webMer.project(item.geometry, this.SpatialReference.WebMercator));
        // console.log(projLayer);
      }

    });
    return this.createLayer(feature,projFeatures);
  }

/*************************************************
*     METHOD FOR CREATING GRAPHICS FEATURES
**************************************************/
private createPointGraphics(data, attributes) {

  const pointGraphic = [];
  data.map((item, i) => {
    // const latLong = proj4(proj[0]).inverse(item);
    const pointFeature = new this.Graphic({
      geometry: {
        type: "point", // autocasts as new Point()
        longitude: item[0],
        latitude: item[1]
      },
      symbol: {
        type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
        color: [226, 119, 40],
        outline: { // autocasts as new SimpleLineSymbol()
          color: [255, 255, 255],
          width: 1
        }
      },
      attributes: {
        ObjectID: i,
        Name: attributes[i],
        Easting: item[0],
        Northing: item[1]
      },
      popupTemplate: {
        title: "{Name}",
        content: [{
          type: "fields",
          fieldInfos: [{
            fieldName: "Name"
          }, {
            fieldName: "Easting"
          }, {
            fieldName: "Northing"
          }]
        }]
      }
    });
    this.view.graphics.add(pointFeature);
    pointGraphic.push(pointFeature);
  });

  return pointGraphic;
}

private create_polygon(pointsData) {

  const ring = [];
  pointsData.forEach(pt => {
    const point = pt.geometry;
    ring.push([point.x, point.y]);

  });
  ring.push(ring[0]);

  // Add the geometry and symbol to a new graphic
  const polygonGraphic = new this.Graphic({
    geometry: {
      type: "polygon",
      rings: ring,
      spatialReference: { wkid: 4326 }
    },
    // style: "backward-diagonal",
    symbol : {
      type: "simple-line",  // autocasts as new SimpleLineSymbol()
      color: "red",
      width: "3px",
      style: "solid"
    },
    // select only the attributes you care about
    attributes: {
      ObjectID: 0,
      Name: "Target Polygon"
    }
  });

  return polygonGraphic;
}


/**************************************************
* Create a FeatureLayer with the array of graphics
**************************************************/

private createLayer(graphics,projSource) {

  const lyr = new this.FeatureLayer({
    source: projSource, // autocast as an array of esri/Graphic
    // create an instance of esri/layers/support/Field for each field object
    fields: graphics.fields, // This is required when creating a layer from Graphics
    objectIdField: "ObjectID", // This must be defined when creating a layer from Graphics
    spatialReference: {
      wkid: 102100
    },
    geometryType: graphics.geometryType // Must be set when creating a layer from Graphics
    // popupTemplate: pTemplate
  });

  // this.map.add(lyr);
  return lyr;
}



  /**
   * SORTOUT DATA FROM THE SEARCH POLYGON
   *  TABLE HASH ARRAY
   * 
   */
  private polygonSearchQuery(){

    console.log(this.query_params4plot);

  }



}
