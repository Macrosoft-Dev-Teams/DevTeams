import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrl: './create-team.component.css'
})
export class CreateTeamComponent {
  @Output() onCreateTeamCancelled = new EventEmitter();
  @Output() onTeamCreated = new EventEmitter();
  limit = 128;
  teamForm: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.teamForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  onTeamSubmit() {
    if (this.teamForm.value.name?.trim().length === 0) {
       // TODO: implement alert component
			alert('Please provide a name for your team.');
		} else {
			this.apiService.createTeam(
        this.teamForm.value.name!.length > this.limit 
          ? this.teamForm.value.name!.substring(0,this.limit) 
          : this.teamForm.value.name!
      ).subscribe({
				next: () => this.onTeamCreated.emit(),
				error: (error) => {
					alert(error);
				},
			});
		}
  }

  cancelNewTeamCreation() {
    this.onCreateTeamCancelled.emit();
  }
}