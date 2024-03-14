import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { Subject, of } from 'rxjs';
import { TimerPageComponent, TABS } from './timer-page.component';
import { TimerComponent } from '../../features/timer/timer.component';
import { StopwatchComponent } from '../../features/stopwatch/stopwatch.component';
import { TimerControlsComponent } from '../../shared/components/timer-controls/timer-controls.component';
import { TimeDisplayComponent } from '../../shared/components/time-display/time-display.component';
import { MaterialModule } from '../../shared/material.module';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('TimerPageComponent', () => {
  let component: TimerPageComponent;
  let fixture: ComponentFixture<TimerPageComponent>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let routerSpy: jasmine.SpyObj<Router>;
  let destroy$: Subject<void>;
  const activatedRouteStub = {
    data: of({} as Partial<Data>),
  } as Partial<ActivatedRoute>;
  beforeEach(async () => {
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['data']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    destroy$ = new Subject<void>();

    await TestBed.configureTestingModule({
      declarations: [
        TimerPageComponent,
        TimerComponent,
        StopwatchComponent,
        TimerControlsComponent,
        TimeDisplayComponent,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useValue: routerSpy },
      ],
      imports: [MaterialModule, FormsModule, RouterTestingModule, NoopAnimationsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    destroy$.next();
    destroy$.complete();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update selected tab and route when tab changes', () => {
    const selectedIndex = 1;
    const expectedTab = TABS[selectedIndex];
    const expectedRoute = [expectedTab];

    component.tabChange(selectedIndex);

    expect(component.selectedTabIndex).toBe(selectedIndex);
    expect(routerSpy.navigate).toHaveBeenCalledWith(expectedRoute);
  });

  it('should set selected tab based on route data', () => {
    const routeData = { view: TABS[1] };
    activatedRouteSpy.data = of(routeData) as any; // Mocking data as observable

    component.ngOnInit();

    expect(component.selectedTabIndex).toBe(1);
  });
});
