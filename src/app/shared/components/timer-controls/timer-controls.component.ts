import { ChangeDetectionStrategy, Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-timer-controls',
  templateUrl: './timer-controls.component.html',
  styleUrls: ['./timer-controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerControlsComponent implements OnInit {
  /**
   * Document element to handle fullscreen mode
   */
  elem;

  @ViewChild('alarm', { static: true }) alarmElementRef: ElementRef;
  @Input() timerActive: boolean;

  timerStart$ = new BehaviorSubject<boolean>(false);
  timerEnd$ = new BehaviorSubject<boolean>(false);
  timerReset$ = new BehaviorSubject<number>(0);

  stopwatchStart$ = new BehaviorSubject<boolean>(false);
  stopwatchReset$ = new Subject<void>();

  alarm: HTMLAudioElement;
  alarmEnabled = true;
  alarmSounding$ = new BehaviorSubject<boolean>(false);

  fullScreen = false;

  constructor(@Inject(DOCUMENT) private document: any) {}

  ngOnInit() {
    this.alarm = this.alarmElementRef.nativeElement;
    this.elem = document.documentElement;
  }

  startStop() {
    if (this.timerActive) {
      if (!this.timerEnd$.value) {
        this.timerStart$.next(!this.timerStart$.value);
      } else {
        this.stopAlarm();
      }
    } else {
      this.stopwatchStart$.next(!this.stopwatchStart$.value);
    }
  }

  start() {
    if (this.timerActive) {
      this.timerStart$.next(true);
    } else {
      this.stopwatchStart$.next(true);
    }
  }

  stop() {
    if (this.timerActive) {
      this.timerStart$.next(false);
    } else {
      this.stopwatchStart$.next(false);
    }
  }

  reset() {
    if (this.timerActive) {
      this.timerReset$.next(0);
    } else {
      this.stopwatchReset$.next();
    }
  }

  end(timerComplete: boolean) {
    this.timerEnd$.next(timerComplete);
    if (timerComplete) {
      this.startAlarm();
    }
  }

  toggleAlarm() {
    this.alarmEnabled = !this.alarmEnabled;
  }

  startAlarm() {
    if (this.alarmEnabled && !this.alarmSounding$.value) {
      this.alarmSounding$.next(true);
      this.alarm.play();
    }
  }

  stopAlarm() {
    if (this.alarmEnabled && this.alarmSounding$.value) {
      this.alarmSounding$.next(false);
      this.alarm.pause();
    }
  }

  toggleFullscreen() {
    if (!this.fullScreen) {
      this.openFullscreen();
    } else {
      this.closeFullscreen();
    }
    this.fullScreen = !this.fullScreen;
  }

  get started() {
    return this.timerActive ? this.timerStart$.value : this.stopwatchStart$.value;
  }

  /**
   * Function to open fullscreen mode
   */
  openFullscreen() {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
  }

  /**
   * Function to close fullscreen mode
   */
  closeFullscreen() {
    if (document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }
  }
}
