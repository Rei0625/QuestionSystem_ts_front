import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GetUserResponse, User } from '../models/model';

@Component({
  selector: 'app-Top',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './manage_user.component.html',
  styleUrls: ['./manage_user.component.css'],
})
export class ManageUserComponent {
  users: User[] | null = null;
  back_adress = environment.apiUrl;
  Message: String = '';
  errorMessage: String = '';
  showConfirmDialog = false;
  showResetDialog = false;
  selectedUser: User | null = null;

  constructor(private router: Router, private http: HttpClient) {
    this.getUsers();
  }

  getUsers() {
    this.http.get<GetUserResponse>(this.back_adress + 'manage/user_get').subscribe({
      next: (res) => {
        this.users = res.users;
      },
      error: (err) => (this.errorMessage = err.error.error),
    });
  }

  navigateToManageTop(): void {
    this.router.navigate(['/manage']);
  }

  navigateToManageUserCreate(): void {
    this.router.navigate(['/manage/user/create']);
  }

  confirmDelete(user: User) {
    this.selectedUser = user;
    this.showConfirmDialog = true;
  }

  deleteConfirmed() {
    if (this.selectedUser) {
      this.userDelete(this.selectedUser.user_id);
    }
    this.showConfirmDialog = false;
    this.selectedUser = null;
  }

  cancelDelete() {
    this.showConfirmDialog = false;
    this.selectedUser = null;
  }
  //

  confirmReset(user: User) {
    this.selectedUser = user;
    this.showResetDialog = true;
  }

  ResetConfirmed() {
    if (this.selectedUser) {
      this.resetPassword(this.selectedUser.user_id);
    }
    this.showResetDialog = false;
    this.selectedUser = null;
  }

  cancelReset() {
    this.showResetDialog = false;
    this.selectedUser = null;
  }

  userDelete(user_id: String): void {
    const body = {
      user_id: user_id,
    };
    this.http.post<GetUserResponse>(this.back_adress + 'manage/user_delete', body).subscribe({
      next: (res) => {
        this.Message = res.message;
        this.getUsers();
      },
      error: (err) => (this.errorMessage = err.error.error),
    });
  }

  resetPassword(user_id: String) {
    const body = {
      user_id: user_id,
    };
    this.http
      .post<GetUserResponse>(this.back_adress + 'manage/user_reset_password', body)
      .subscribe({
        next: (res) => {
          this.Message = res.message;
          this.getUsers();
        },
        error: (err) => (this.errorMessage = err.error.error),
      });
  }
}
