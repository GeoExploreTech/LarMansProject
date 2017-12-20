import { TestBed, inject } from '@angular/core/testing';

import { AppDataModelService } from './app-data-model.service';

describe('AppDataModelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppDataModelService]
    });
  });

  it('should be created', inject([AppDataModelService], (service: AppDataModelService) => {
    expect(service).toBeTruthy();
  }));
});
