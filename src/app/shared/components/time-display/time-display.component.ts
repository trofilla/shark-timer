import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-time-display',
  templateUrl: './time-display.component.html',
  styleUrls: ['./time-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeDisplayComponent {
  private readonly hourInMs = 3600000;
  private readonly minuteInMs = 60000;
  private readonly secondInMs = 1000;

  /**
   * Time that should be displayed in ms
   */
  @Input() time;
  /**
   * Flag to show ms
   */
  @Input() showHundreds = true;
  /**
   * Flag to be able to set time
   */
  @Input() canSetTime = false;
  /**
   * Flag to set default time
   */
  @Output() setTime = new EventEmitter<number>();

  settingTime$ = new BehaviorSubject<boolean>(false);
  inputHours: number;
  inputMinutes: number;
  inputSeconds: number;

  constructor() {}

  inputChange(hours: number, minutes: number, seconds: number) {
    const timeVal = hours * this.hourInMs + minutes * this.minuteInMs + seconds * this.secondInMs;
    this.setTime.emit(timeVal);
  }

  startSetTime() {
    if (this.canSetTime) {
      this.settingTime$.next(true);
      this.inputHours = this.hours;
      this.inputMinutes = this.minutes;
      this.inputSeconds = this.seconds;
    }
  }
  endSetTime() {
    this.settingTime$.next(false);
  }

  get hours(): number {
    return Math.floor(this.time / this.hourInMs);
  }

  get minutes(): number {
    return Math.floor((this.time / this.minuteInMs) % 60);
  }

  get seconds(): number {
    return Math.floor((this.time / this.secondInMs) % 60);
  }

  get secondsDigitTwo(): number {
    return this.digitTwo(this.seconds);
  }
  get secondsDigitOne(): number {
    return this.digitOne(this.seconds);
  }

  get ms(): number {
    return Math.floor((this.time / 10) % 100);
  }

  get msDigitTwo(): number {
    return this.digitTwo(this.ms);
  }
  get msDigitOne(): number {
    return this.digitOne(this.ms);
  }

  private digitTwo(val: number) {
    return Math.floor((val / 10) % 10);
  }
  private digitOne(val: number) {
    return val % 10;
  }
}
