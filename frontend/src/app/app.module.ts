import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { RouterOutlet } from '@angular/router';

import { Amplify } from 'aws-amplify';
import { AmplifyAuthenticatorModule } from "@aws-amplify/ui-angular";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from "./pages/login/login.component";

import { environment } from '@src/environments/environment';

Amplify.configure({
	Auth: {
		Cognito: {
			userPoolId: environment.userPoolId,
			userPoolClientId: environment.userPoolClientId,
		},
	},
});

@NgModule({
	declarations: [AppComponent, LoginComponent],
	imports: [RouterOutlet, BrowserModule, AppRoutingModule, AmplifyAuthenticatorModule],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
