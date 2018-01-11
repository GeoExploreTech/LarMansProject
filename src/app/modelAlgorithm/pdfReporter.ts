import { ProjectionModel } from '../modelAlgorithm/projection';
declare var jsPDF: any; // Important


export class PdfReporter{
    private doc:any;
    constructor(){
        this.doc = new jsPDF('p', 'pt');
        
    }


    
}