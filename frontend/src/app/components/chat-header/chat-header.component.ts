import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Chat } from '@src/app/interfaces';
import { ApiService } from '@src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { debounce, interval } from 'rxjs';

@Component({
	selector: 'app-chat-header',
	templateUrl: './chat-header.component.html',
	styleUrl: './chat-header.component.css',
})
export class ChatHeaderComponent {
	@Input() chat: Partial<Chat> = {};
	newMemberEmail?: FormControl<string | null>;

	constructor(
		private apiService: ApiService,
		private toast: ToastrService,
	) {}

	onSubmitNewMemberInvite() {
		if (this.newMemberEmail!.value!.trim().length === 0) {
			this.toast.warning(
				'Please provide the email of the person to invite to this chat.',
				'No email!',
			);
		} else {
			this.apiService
				.inviteTeamMember(this.newMemberEmail!.value!, this.chat.teamId!)
				.subscribe({
					next: () => {
						this.toast.success('Team member invited to chat', 'Success');
						this.newMemberEmail = undefined;
					},

					error: (error) => {
						this.toast.error(error, 'Error!');
					},
				});
		}
	}

	toggleNewMemberEmailInput() {
		if (this.newMemberEmail) {
			this.newMemberEmail = undefined;
		} else {
			this.newMemberEmail = new FormControl('');
		}
	}
}
