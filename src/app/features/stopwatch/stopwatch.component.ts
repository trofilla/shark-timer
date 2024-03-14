import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EMPTY, Observable, Subject, timer } from 'rxjs';
import { mapTo, scan, switchMap, takeUntil } from 'rxjs/operators';

import { TimerControlsComponent } from '../../shared/components/timer-controls/timer-controls.component';

@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StopwatchComponent implements OnInit, OnDestroy {
  @Input() controls: TimerControlsComponent;

  displayedTime$: Observable<number>;
  private interval$: Observable<number>;
  private reset$ = new Subject<void>();
  destroy$ = new Subject<void>();

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.interval$ = timer(0, 10);
    this.resetTimer();

    this.controls.stopwatchReset$.subscribe(() => {
      this.resetTimer();
      this.controls.stop();
      this.cd.markForCheck();
    });
  }

  resetTimer() {
    this.reset$.next();

    this.displayedTime$ = this.controls.stopwatchStart$.pipe(
      switchMap(start => (start ? this.interval$.pipe(mapTo(10)) : EMPTY)),
      scan((acc, val) => acc + val, 0),
      takeUntil(this.reset$),
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
