import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

export const TABS = {
  0: 'timer',
  1: 'stopwatch',
};

@Component({
  selector: 'app-timer-page',
  templateUrl: './timer-page.component.html',
  styleUrls: ['./timer-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerPageComponent implements OnInit, OnDestroy {
  selectedTabIndex = 0;
  /**
   * Unsubscribe stream
   */
  destroy$ = new Subject<void>();

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.data
      .pipe(
        filter(routeData => !!routeData),
        takeUntil(this.destroy$),
      )
      .subscribe(routeData => {
        this.selectedTabIndex = routeData.view === TABS[0] ? 0 : 1;
      });
  }

  /**
   * Update selected tab and route associated with it
   */
  tabChange(selectedTabIndex: number) {
    this.selectedTabIndex = selectedTabIndex;
    this.router.navigate([TABS[selectedTabIndex]]);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
