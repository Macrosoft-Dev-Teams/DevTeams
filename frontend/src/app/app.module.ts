import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import {MatIconModule} from '@angular/material/icon';

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
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { ChatHeaderComponent } from './components/chat-header/chat-header.component';
import { NavbarHeaderComponent } from './components/navbar-header/navbar-header.component';
TimeAgo.addDefaultLocale(en);

@Pipe({
	name: 'asTimeAgo',
})
export class IsoTimeAgoPipe implements PipeTransform {
	timeAgo = new TimeAgo('en-US');

	transform(isoString: string): string {
		return this.timeAgo.format(new Date(isoString));
	}
}
import { ChatListItemComponent } from './components/chat-list-item/chat-list-item.component';
import { ChatListComponent } from './components/chat-list/chat-list.component';
import { MainChatDetailsViewComponent } from './components/main-chat-details-view/main-chat-details-view.component';
import { ChatsControllerComponent } from './components/chats-controller/chats-controller.component';
import { HomeComponent } from './pages/home/home.component';
import { TeamInviteMessageComponent } from './components/team-invite-message/team-invite-message.component';

TimeAgo.addDefaultLocale(en);

@Pipe({
	name: 'asTimeAgo',
})
export class IsoTimeAgoPipe implements PipeTransform {
	timeAgo = new TimeAgo('en-US');

	transform(isoString: string): string {
		return this.timeAgo.format(new Date(isoString));
	}
}


@Pipe({
  name: 'asTeamInviteId'
})
export class AsTeamInviteIdPipe implements PipeTransform {
  transform(inviteMessage: string): number | undefined {
		const matches = RegExp(/\d+/).exec(inviteMessage);
		return matches ? parseInt(matches[0]) : undefined;
  }
}
import { LogoComponent } from './components/logo/logo.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

Amplify.configure({
	Auth: {
		Cognito: {
			userPoolId: environment.userPoolId,
			userPoolClientId: environment.userPoolClientId,
		},
	},
});

@NgModule({
	declarations: [
		IsoTimeAgoPipe,
		CreateTeamComponent,
		ChatInputComponent,
		AppComponent,
		HomeComponent,
		LoginComponent,
		MessagesListComponent,
		ChatHeaderComponent,
		NavbarHeaderComponent,
		ChatListItemComponent,
		ChatListComponent,
		MainChatDetailsViewComponent,
		ChatsControllerComponent,
		LogoComponent,
	],
	imports: [
		MatIconModule,
		RouterOutlet,
		BrowserModule,
		AppRoutingModule,
		AmplifyAuthenticatorModule,
		ReactiveFormsModule,
		BrowserAnimationsModule,
		ToastrModule.forRoot({
			timeOut: 10000,
			positionClass: 'toast-bottom-right',
			preventDuplicates: true,
			resetTimeoutOnDuplicate: true,
			maxOpened: 3,
			autoDismiss: true,
		}),
	],
	providers: [provideHttpClient(), provideAnimationsAsync()],
	bootstrap: [AppComponent],
})
export class AppModule {}
