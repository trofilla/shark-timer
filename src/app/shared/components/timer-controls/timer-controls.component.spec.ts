import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialModule } from '../../material.module';
import { TimerControlsComponent } from './timer-controls.component';

describe('TimerControlsComponent', () => {
  let component: TimerControlsComponent;
  let fixture: ComponentFixture<TimerControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimerControlsComponent],
      imports: [MaterialModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should end timer', () => {
    const spyNext = spyOn(component.timerEnd$, 'next');

    component.end(true);
    expect(spyNext).toHaveBeenCalledWith(true);
  });

  it('should toggle alarm', () => {
    component.toggleAlarm();
    expect(component.alarmEnabled).toBeFalsy();

    component.toggleAlarm();
    expect(component.alarmEnabled).toBeTruthy();
  });
});
