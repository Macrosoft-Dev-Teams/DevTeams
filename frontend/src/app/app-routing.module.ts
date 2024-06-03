import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { LoggedOutComponent } from './pages/logged-out/logged-out.component';
import { authGuard } from './auth.guard';

const routes: Routes = [
	{
		path: '',
		component: LoggedOutComponent,
	},
	{
		path: 'login',
		component: LoginComponent,
	},
	{
		path: 'home',
		canActivate: [authGuard],
		component: HomeComponent,
	},
	{ path: '**', canActivate: [authGuard], component: HomeComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
