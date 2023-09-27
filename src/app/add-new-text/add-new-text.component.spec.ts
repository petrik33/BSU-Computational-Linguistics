import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewTextComponent } from './add-new-text.component';

describe('AddNewTextComponent', () => {
  let component: AddNewTextComponent;
  let fixture: ComponentFixture<AddNewTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewTextComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
