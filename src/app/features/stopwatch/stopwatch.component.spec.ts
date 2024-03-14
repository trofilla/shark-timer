import { ChangeDetectorRef } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { BehaviorSubject, Subject } from 'rxjs';
import { StopwatchComponent } from './stopwatch.component';
import { TimerControlsComponent } from '../../shared/components/timer-controls/timer-controls.component';
import { TimeDisplayComponent } from '../../shared/components/time-display/time-display.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../shared/material.module';

describe('StopwatchComponent', () => {
  let component: StopwatchComponent;
  let fixture: ComponentFixture<StopwatchComponent>;
  let controlsComponent: TimerControlsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StopwatchComponent, TimeDisplayComponent],
      providers: [ChangeDetectorRef],
      imports: [MaterialModule, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(StopwatchComponent);
    component = fixture.componentInstance;

    // Simulate input data
    controlsComponent = {
      stopwatchStart$: new BehaviorSubject<boolean>(false),
      stopwatchReset$: new Subject<void>(),
      stop: jasmine.createSpy(),
    } as unknown as TimerControlsComponent;

    component.controls = controlsComponent;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset timer when stopwatchReset$ emits', () => {
    const spyResetTimer = spyOn(component, 'resetTimer').and.callThrough();

    controlsComponent.stopwatchReset$.next();

    expect(spyResetTimer).toHaveBeenCalled();
  });

  it('should start timer when stopwatchStart$ emits true', () => {
    component.controls.stopwatchStart$.next(true);
    fixture.detectChanges();

    expect(component.displayedTime$).toBeDefined();
  });

  it('should unsubscribe onDestroy', () => {
    const spyDestroy = spyOn(component.destroy$, 'next');
    const spyComplete = spyOn(component.destroy$, 'complete');

    component.ngOnDestroy();

    expect(spyDestroy).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});
