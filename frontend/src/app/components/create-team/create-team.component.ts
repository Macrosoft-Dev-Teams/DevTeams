import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrl: './create-team.component.css'
})
export class CreateTeamComponent {
  @Output() dataEvent = new EventEmitter<string>();
  teamForm: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.teamForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  onTeamSubmit() {
    if (this.teamForm.value.name?.trim().length === 0) {
			alert('Please provide a name for your team.');
		} else {
			this.apiService.createTeam(this.teamForm.value.name!).subscribe({
				next: () => {},
				error: (error) => {
					alert(error);
				},
			});
		}
  }

  cancelNewTeamCreation() {
    const data = 'Cancel new team plz';
    this.dataEvent.emit(data);
  }
}