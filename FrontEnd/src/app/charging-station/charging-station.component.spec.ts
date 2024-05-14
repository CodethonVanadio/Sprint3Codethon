import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargingStationComponent } from './charging-station.component';

describe('ChargingStationComponent', () => {
  let component: ChargingStationComponent;
  let fixture: ComponentFixture<ChargingStationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChargingStationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChargingStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
