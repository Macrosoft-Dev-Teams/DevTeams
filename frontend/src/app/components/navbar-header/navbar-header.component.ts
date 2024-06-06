import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from '@src/app/services/auth.service';

@Component({
	selector: 'app-navbar-header',
	templateUrl: './navbar-header.component.html',
	styleUrl: './navbar-header.component.css',
})
export class NavbarHeaderComponent {
	@Output() onSearchChanged = new EventEmitter<string>();
	@Output() onCreateNewTeam = new EventEmitter<void>();
	searchText = new FormControl('');

	constructor(private authService: AuthService) {}

	ngOnInit() {
		this.searchText.valueChanges.subscribe({
			next: (value) => this.onSearchChanged.emit(value ?? ''),
		});
	}

	signOut() {
		this.authService.signOut();
	}

	onCreateNewTeamButtonClicked() {
		this.onCreateNewTeam.emit();
	}
}
