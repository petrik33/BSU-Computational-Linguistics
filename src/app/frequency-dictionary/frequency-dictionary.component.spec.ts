import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrequencyDictionaryComponent } from './frequency-dictionary.component';

describe('FrequencyDictionaryComponent', () => {
  let component: FrequencyDictionaryComponent;
  let fixture: ComponentFixture<FrequencyDictionaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrequencyDictionaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrequencyDictionaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
