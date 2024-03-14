import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from '../../material.module';
import { TimeDisplayComponent } from './time-display.component';

describe('TimeDisplayComponent', () => {
  let component: TimeDisplayComponent;
  let fixture: ComponentFixture<TimeDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimeDisplayComponent],
      imports: [MaterialModule, FormsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit setTime event when inputChange is called', () => {
    const hours = 1;
    const minutes = 30;
    const seconds = 45;
    const expectedTime = hours * 3600000 + minutes * 60000 + seconds * 1000;
    const setTimeSpy = spyOn(component.setTime, 'emit');

    component.inputChange(hours, minutes, seconds);

    expect(setTimeSpy).toHaveBeenCalledWith(expectedTime);
  });

  it('should return correct hours', () => {
    component.time = 3661000; // 1 hour, 1 minute, 1 second
    const expectedHours = 1;
    const hours = component.hours;

    expect(hours).toBe(expectedHours);
  });
});
