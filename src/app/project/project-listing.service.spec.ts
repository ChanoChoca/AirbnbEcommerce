import { TestBed } from '@angular/core/testing';

import { ProjectListingService } from './project-listing.service';

describe('ProjectListingService', () => {
  let service: ProjectListingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectListingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
