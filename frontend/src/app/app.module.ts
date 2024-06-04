import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { RouterOutlet } from '@angular/router';

import { Amplify } from 'aws-amplify';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';

import { environment } from '@src/environments/environment';
import { ChatInputComponent } from './components/chat-input/chat-input.component';
import { CreateTeamComponent } from './components/create-team/create-team.component';
import { provideHttpClient } from '@angular/common/http';
import { MessagesListComponent } from './components/messages-list/messages-list.component';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en';
import { ChatHeaderComponent } from './components/chat-header/chat-header.component';
import { NavbarHeaderComponent } from './components/navbar-header/navbar-header.component'
TimeAgo.addDefaultLocale(en);

@Pipe({
  name: 'asTimeAgo'
})
export class IsoTimeAgoPipe implements PipeTransform {
	timeAgo = new TimeAgo("en-US");

  transform(isoString: string): string {
    return this.timeAgo.format(new Date(isoString));
  }
}

Amplify.configure({
	Auth: {
		Cognito: {
			userPoolId: environment.userPoolId,
			userPoolClientId: environment.userPoolClientId,
		},
	},
});

@NgModule({
	declarations: [IsoTimeAgoPipe, CreateTeamComponent, ChatInputComponent, AppComponent, LoginComponent, MessagesListComponent, ChatHeaderComponent, NavbarHeaderComponent],
	imports: [
		RouterOutlet,
		BrowserModule,
		AppRoutingModule,
		AmplifyAuthenticatorModule,
		ReactiveFormsModule,
	],
	providers: [provideHttpClient()],
	bootstrap: [AppComponent],
})
export class AppModule {}
