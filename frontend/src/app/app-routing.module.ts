import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { LoggedOutComponent } from './pages/logged-out/logged-out.component';

const routes: Routes = [
  {
    // TODO: add auth guard
    path: '',
    component: LoggedOutComponent
  },
  {
    // TODO: disable direct path to cognito login
    // TODO: add auth guard
    path: 'login',
    component: LoginComponent
  },
  {
    // TODO: add auth guard
    path: 'home',
    component: HomeComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
