import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimerPageComponent } from './main/timer-page/timer-page.component';

const routes: Routes = [
  { path: 'timer', component: TimerPageComponent, data: {view: 'timer'} },
  { path: 'stopwatch', component: TimerPageComponent, data: {view: 'stopwatch'} },
  { path: '', redirectTo: '/timer', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
