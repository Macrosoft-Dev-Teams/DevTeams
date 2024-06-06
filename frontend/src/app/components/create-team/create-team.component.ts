import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-create-team',
	templateUrl: './create-team.component.html',
	styleUrl: './create-team.component.css',
})
export class CreateTeamComponent {
	@Output() onCreateTeamCancelled = new EventEmitter();
	@Output() onTeamCreated = new EventEmitter<number>();
	limit = 128;
	teamForm: FormGroup;

	constructor(
		private fb: FormBuilder,
		private apiService: ApiService,
		private toastr: ToastrService,
	) {
		this.teamForm = this.fb.group({
			name: ['', Validators.required],
		});
	}

	onTeamSubmit() {
		if (this.teamForm.value.name?.trim().length === 0) {
			this.toastr.warning(
				'Please provide a name for your team.',
				'No team name!',
			);
		} else {
			this.apiService
				.createTeam(
					this.teamForm.value.name!.length > this.limit
						? this.teamForm.value.name!.substring(0, this.limit)
						: this.teamForm.value.name!,
				)
				.subscribe({
					next: (teamId) => this.onTeamCreated.emit(teamId),
					error: (error) => {
						this.toastr.error(error, 'Error!');
					},
				});
		}
	}

	cancelNewTeamCreation() {
		this.onCreateTeamCancelled.emit();
	}
}
