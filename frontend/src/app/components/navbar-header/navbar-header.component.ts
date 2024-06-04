import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'app-navbar-header',
	templateUrl: './navbar-header.component.html',
	styleUrl: './navbar-header.component.css',
})
export class NavbarHeaderComponent {
	@Output() onSearchChanged = new EventEmitter<string>();
	@Output() onCreateNewTeam = new EventEmitter<void>();
	searchText = new FormControl('');

	ngOnInit() {
		this.searchText.valueChanges.subscribe({
			next: (value) => this.onSearchChanged.emit(value ?? ''),
		});
	}

	onCreateNewTeamButtonClicked() {
		this.onCreateNewTeam.emit();
	}
}
