import { forEach } from '@angular/router/src/utils/collection';
import { ProjectionModel } from '../modelAlgorithm/projection';
declare var jsPDF: any; // Important





export class PdfReporter{
    private doc:any;
    private dataId: string[] = [
        "FEATURE ID",
        "ESTATE NAME",
        "BLOCK ID",
        "PLOT NUMBER",
        "PLAN NUMBER",
        "OVERLAP-FEATURE SIZE (Sq.m)",
        "SEARCH-FEATURE SIZE (Sq.m)",
        "PERCENTAGE OVERLAP",
        "STREET ID",
        "STREET NAME",
        "LCDA",
        "LGA",
        "CITY ",
        "REGION",
        "COUNTRY",
        "STATUS"
    ];

    private dataArrayQuery: any;
    private numOfFeatures: Number;


    constructor() {
        this.doc = new jsPDF('p', 'mm','a4');
    }

    public initWriterModule(dataArrayQuery: any, numOfFeatures: Number){
        this.dataArrayQuery = this.getChattingData(dataArrayQuery);
        this.numOfFeatures = numOfFeatures;
    }

    // Content - shows how tables can be integrated with any other pdf content
    public writeChattingReport () {
            
        this.doc.setFontSize(18);
        this.doc.setTextColor(54, 124, 237);
        this.doc.setFontStyle("italic")
        this.doc.text(' LARMANS PARCEL CHATTING GENERATED REPORT ', 20, 22);

        this.doc.setFontSize(12);
        
        for( let j=0; j<this.numOfFeatures; j++){
            this.doc.autoTable(this.getDetailColumns().splice(1, 2), this.dataArrayQuery[j], {
                showHeader: 'never',
                columnStyles: {
                    heading: {fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold'}
                }
            });
        }
    
    
        return this.doc;
    };

    // Returns a new array each time to avoid pointer issues
    private getDetailColumns = function () {
        return [
            {title: "HEADING", dataKey: "heading"},
            {title: "DETAILS", dataKey: "detail"}
        ];
    };

    private getId_EastingNorthingColumns = function() {
        return[
            {title: "STATION ID", dataKey: "id"},
            {title: "EASTING (m)", dataKey: "easting"},
            {title: "NORTHING (m)", dataKey: "northing"}

        ];
    }



    private getChattingData(dataArrayQuery:any[]){
        const finalData = [];

        for(let i=0; i<dataArrayQuery.length; i++){
            const data = [];
            let count = 0;
            dataArrayQuery[i].forEach(item =>{
                data.push({
                    heading: this.dataId[count],
                    detail: item
                });
    
                count = count +1;
            });

            finalData.push(data);
        }


        return finalData;
    }

    
}