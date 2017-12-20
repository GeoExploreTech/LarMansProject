import { Injectable } from '@angular/core';
import {BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AppDataModelService {

  private isEsriMapOpens = new BehaviorSubject<boolean>(true);
  isEsriMapOpen = this.isEsriMapOpens.asObservable();
  constructor() { }

  esriMapState(isEsriMapOpen){
    this.isEsriMapOpens = isEsriMapOpen;
  }

}
