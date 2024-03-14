import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from '../../shared/material.module';
import { TimeDisplayComponent } from '../../shared/components/time-display/time-display.component';
import { TimerControlsComponent } from '../../shared/components/timer-controls/timer-controls.component';
import { TimerComponent } from './timer.component';
import { BehaviorSubject, Subject } from 'rxjs';

describe('TimerComponent', () => {
  let component: TimerComponent;
  let fixture: ComponentFixture<TimerComponent>;
  let controlsComponent: TimerControlsComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimerComponent, TimeDisplayComponent, TimerControlsComponent],
      imports: [MaterialModule, FormsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerComponent);
    component = fixture.componentInstance;

    controlsComponent = {
      timerStart$: new BehaviorSubject<boolean>(false),
      timerReset$: new Subject<void>(),
      stop: jasmine.createSpy(),
      end: jasmine.createSpy(),
    } as unknown as TimerControlsComponent;

    component.controls = controlsComponent;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should end timer when timerStart$ emits true', () => {
    spyOn(component.timeDisplay, 'endSetTime');

    controlsComponent.timerStart$.next(true);
    fixture.detectChanges();

    expect(component.timeDisplay.endSetTime).toHaveBeenCalled();
  });

  it('should set startTime and reset timer on setTime call', () => {
    const startTime = 60000; // 1 minute

    component.setTime(startTime);

    expect(component.startTime).toEqual(startTime);
    expect(component.displayedTime$).toBeTruthy();
    expect(component.percent$).toBeTruthy();
  });

  it('should unsubscribe onDestroy', () => {
    spyOn(component.destroy$, 'next');
    spyOn(component.destroy$, 'complete');

    component.ngOnDestroy();

    expect(component.destroy$.next).toHaveBeenCalled();
    expect(component.destroy$.complete).toHaveBeenCalled();
  });
});
