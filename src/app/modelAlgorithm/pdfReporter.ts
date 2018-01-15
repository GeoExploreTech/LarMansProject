import { ProjectionModel } from '../modelAlgorithm/projection';
declare var jsPDF: any; // Important


export class PdfReporter{
    private doc:any;
    constructor(){
        this.doc = new jsPDF('p', 'pt');
        
    }

    // Content - shows how tables can be integrated with any other pdf content
    public contentDisplay () {
        var doc = new jsPDF();
    
        doc.setFontSize(18);
        doc.text('INPUT PERCEL INFORMATION', 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        var text = ""
        doc.text(text, 14, 30);
    
        var cols = this.getColumns();
        cols.splice(0, 2);
        doc.autoTable(cols, getData(40), {startY: 50, showHeader: 'firstPage'});
    
        doc.text(text, 14, doc.autoTable.previous.finalY + 10);
    
    
        return doc;
    };

    // Returns a new array each time to avoid pointer issues
    private getColumns = function () {
        return [
            {title: "STATION ID", dataKey: "id"},
            {title: "EASTING (m)", dataKey: "easting"},
            {title: "NORTHING (m)", dataKey: "northing"},
            {title: "FEATURE ID", dataKey: "feature"},
            {title: "ESTATE NAME", dataKey: "estateName"},
            {title: "PLOT NUMBER", dataKey: "plotNumber"},
            {title: "PLAN NUMBER", dataKey: "planNumber"},
            {title: "ADDRESS", dataKey: "address"},
            {title: "SIZE (Sq.m)", dataKey: "size"},
            {title: "PERCENTAGE OVERLAP", dataKey: "percentageOverlap"},
            {title: "STATUS", dataKey: "status"}
        ];
    };


    // public getData(rowCount) {

    //     var data = [];
    //     for (var j = 1; j <= rowCount; j++) {
    //         data.push({
    //             id: j,
    //             name: faker.name.findName(),
    //             email: faker.internet.email(),
    //             country: faker.address.country(),
    //             city: faker.address.city(),
    //             expenses: faker.finance.amount(),
    //             text: shuffleSentence(sentence),
    //             text2: faker.lorem.words(1)
    //         });
    //     }
    //     return data;
    // }
    


    
}