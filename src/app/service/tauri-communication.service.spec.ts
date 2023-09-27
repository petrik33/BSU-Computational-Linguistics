import { TestBed } from '@angular/core/testing';

import { TauriCommunicationService } from './tauri-communication.service';

describe('TauriCommunicationService', () => {
  let service: TauriCommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TauriCommunicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
