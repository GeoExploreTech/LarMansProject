import { forEach } from '@angular/router/src/utils/collection';
import { ProjectionModel } from '../modelAlgorithm/projection';
declare var jsPDF: any; // Important





export class PdfReporter{
    private doc:any;
    private dataId: string[] = [
        "FEATURE ID",
        "ESTATE NAME",
        "PLOT NUMBER",
        "PLAN NUMBER",
        "ADDRESS",
        "SIZE (Sq.m)",
        "PERCENTAGE OVERLAP",
        "STATUS"
    ];

    private dataArray: any[];
    private numOfFeatures: Number;


    constructor(dataArray: any[], numOfFeatures: Number ){
        this.doc = new jsPDF('p', 'mm','a4');
        this.dataArray = dataArray;
        this.numOfFeatures = numOfFeatures;
    }

    // Content - shows how tables can be integrated with any other pdf content
    public writeChattingReport () {
            
        this.doc.setFontSize(18);
        this.doc.setTextColor(54, 124, 237);
        this.doc.setFontStyle("italic")
        this.doc.text(' LARMANS PARCEL CHATTING GENERATED REPORT ', 20, 22);

        this.doc.setFontSize(12);
        
        
        var text = "LARMANS PERCEL CHARTING RESULT"
        this.doc.text(text, 14, 30);
    
        // var cols = this.getColumns();
        // cols.splice(0, 2);
        // doc.autoTable(cols, getData(40), {startY: 50, showHeader: 'firstPage'});
    
        // this.doc.text(text, 14, this.doc.autoTable.previous.finalY + 10);
    
    
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



    public getChattingData(dataArray){
        const data = [];
        let count = 0;
        dataArray.forEach(item =>{
            data.push({
                heading: this.dataId[count],
                detail: item
            });

            count = count +1;
        });

        return data;
    }




    public writeChatingReport(){

    }

    
}