import { Component, Input } from '@angular/core';
import { ApiService } from '@src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-team-invite-message',
	templateUrl: './team-invite-message.component.html',
	styleUrl: './team-invite-message.component.css',
})
export class TeamInviteMessageComponent {
	@Input() inviteId = -1;
	@Input() message = '';
	showButtons = false;

	constructor(
		private apiService: ApiService,
		private toast: ToastrService,
	) {}

	updateInviteState(accepted: boolean) {
		this.apiService.updateInvite(this.inviteId, accepted).subscribe({
			next: () => {
				this.toast.success(accepted ? 'Accepted invite' : 'Declined invite', 'Success!');
        this.showButtons = false;
			},

			error: (error) => {
				this.toast.error(error, 'Error!');
			},
		});
	}

	ngOnInit() {
		this.apiService.getTeamInvite(this.inviteId).subscribe({
			next: (teamInvite) => {
				if (teamInvite.deletedAt) {
					this.showButtons = false;
					this.message = 'Team invite no longer valid.';
				} else {
					this.showButtons = true;
				}
			},

			error: (error) => {
				this.message = `${error}`;
			},
		});
	}
}
