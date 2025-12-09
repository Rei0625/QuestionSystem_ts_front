import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-Top',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create_user.component.html',
  styleUrls: ['./create_user.component.css'],
})
export class createUserComponent {
  user_name: String = '';
  email: String = '';
  password: String = '';
  password_confirm: String = '';
  errorMessage: String = '';
  back_adress = '';

  constructor(private router: Router, private http: HttpClient) {}

  navigateToTop(): void {
    console.log('トップ画面');
    this.router.navigate(['/']);
  }
  create_user(): void {
    console.log('アカウント作成開始');
    if (this.password != this.password_confirm) {
      this.errorMessage = 'パスワードが一致しません';
      return;
    } else if (!this.user_name.trim() || !this.password.trim() || !this.email.trim()) {
      this.errorMessage = 'ユーザーネームとパスワード、メールアドレスを入力してください。';
      return;
    } else {
      const body = {
        user_name: this.user_name,
        password: this.password,
        email: this.email,
        admin_id: 20,
      };

      this.back_adress = environment.apiUrl + 'user/create_user';

      console.log(this.back_adress);

      this.http.post(this.back_adress, body).subscribe({
        next: (res) => this.router.navigate(['/login']),
        error: (err) => (this.errorMessage = err.error.error),
      });
    }
  }
}
