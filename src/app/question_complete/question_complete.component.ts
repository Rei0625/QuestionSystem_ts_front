import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { cookieService } from '../service/cookieService';

@Component({
  selector: 'app-Top',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './question_complete.component.html',
  styleUrls: ['./question_complete.component.css'],
})
export class QuestionCompleteComponent {
  constructor(private router: Router, private cookie: cookieService) {}

  navigateToTop(): void {
    this.router.navigate(['/']);
  }

  navigateToScore() {
    this.router.navigate(['/score']);
  }
}
