import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { cookieService } from '../service/cookieService';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-Top',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './manage_top.component.html',
  styleUrls: ['./manage_top.component.css'],
})
export class ManageTopComponent {
  back_adress = environment.apiUrl;
  constructor(private router: Router, private cookie: cookieService, private http: HttpClient) {}
  navigateToLogout(): void {
    this.http.post(this.back_adress + 'logout', {}, { withCredentials: true }).subscribe({
      next: () => {
        this.cookie.Logout_cookie();
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Logout failed', err);
      },
    });
  }

  navigateToManageGernre(): void {
    this.router.navigate(['/manage/gernre']);
  }
  navigateToManageQuestion(): void {
    this.router.navigate(['/manage/question']);
  }
  navigateToManageUser(): void {
    this.router.navigate(['/manage/user']);
  }
  navigateToManageMarks(): void {
    this.router.navigate(['/manage/marks']);
  }
}
