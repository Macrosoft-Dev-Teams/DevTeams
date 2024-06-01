import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { Amplify } from 'aws-amplify';
import { AmplifyAuthenticatorModule } from "@aws-amplify/ui-angular";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';

Amplify.configure({
	Auth: {
		Cognito: {
			userPoolId: environment.userPoolId,
			userPoolClientId: environment.userPoolClientId,
		},
	},
});

@NgModule({
	declarations: [AppComponent, LoginComponent, HomeComponent],
	imports: [BrowserModule, AppRoutingModule, AmplifyAuthenticatorModule],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
