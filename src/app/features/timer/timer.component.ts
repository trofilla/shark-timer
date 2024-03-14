import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { EMPTY, Observable, Subject, timer } from 'rxjs';
import { filter, map, mapTo, scan, startWith, switchMap, takeUntil, takeWhile, tap } from 'rxjs/operators';

import { TimeDisplayComponent } from '../../shared/components/time-display/time-display.component';
import { TimerControlsComponent } from '../../shared/components/timer-controls/timer-controls.component';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerComponent implements OnInit, OnDestroy {
  @ViewChild('timeDisplay', { static: true }) timeDisplay: TimeDisplayComponent;
  @Input() controls: TimerControlsComponent;

  displayedTime$: Observable<number>;
  percent$: Observable<number>;
  interval$: Observable<number>;
  reset$: Subject<void> = new Subject<void>();
  destroy$ = new Subject<void>();
  startTime: number = 5 + 1000 * 60 * 5;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.interval$ = timer(0, 10);

    this.setupReset();
    this.setupTimeDisplay();
    this.setupTimerStart();
  }

  private setupReset(): void {
    this.controls.timerReset$.subscribe(() => {
      this.resetTimer(this.startTime);
      this.controls.stop();
      this.cd.markForCheck();
    });
  }

  private setupTimeDisplay(): void {
    this.timeDisplay.settingTime$.pipe(filter(settingTime => settingTime)).subscribe(() => this.controls.stop());
  }

  private setupTimerStart(): void {
    this.controls.timerStart$.pipe(filter(start => start)).subscribe(() => this.timeDisplay.endSetTime());
  }

  private resetTimer(startTime: number): void {
    this.reset$.next();
    this.controls.end(false);

    this.displayedTime$ = this.controls.timerStart$.pipe(
      switchMap(start => (start ? this.interval$.pipe(mapTo(10)) : EMPTY)),
      scan((acc, val) => acc - val, startTime),
      startWith(startTime),
      tap(val => {
        if (val === 0) {
          this.controls.end(true);
        }
      }),
      takeUntil(this.reset$),
      takeWhile(val => val >= 0),
    );

    this.percent$ = this.displayedTime$.pipe(map(time => (1 - time / startTime) * 100));
  }

  setTime(startTime: number): void {
    this.startTime = startTime;
    this.resetTimer(this.startTime);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
