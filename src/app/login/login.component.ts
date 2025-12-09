import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { cookieService } from '../service/cookieService';
import { LoginResponse } from '../models/model';

@Component({
  selector: 'app-Top',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class loginComponent {
  user_name: String = '';
  password: String = '';
  errorMessage: String = '';
  back_adress = '';

  constructor(private router: Router, private http: HttpClient, private cookie: cookieService) {}

  navigateToTop(): void {
    console.log('トップ画面');
    this.router.navigate(['/']);
  }
  navigateToCreateUser() {
    this.router.navigate(['/create_user']);
  }
  login(): void {
    console.log('ログイン開始');
    if (!this.user_name.trim() || !this.password.trim()) {
      this.errorMessage = 'ユーザーネームとパスワードを入力してください。';
      return;
    } else {
      const body = {
        user_name: this.user_name,
        password: this.password,
      };

      this.back_adress = environment.apiUrl + 'user/login';

      console.log(this.back_adress);

      this.http.post<LoginResponse>(this.back_adress, body, { withCredentials: true }).subscribe({
        next: (res) => {
          const loginResponse = new LoginResponse(res);
          console.log(loginResponse);
          this.cookie.Login_cookie(loginResponse.user.user_id, loginResponse.user.user_name);
          if (res.token == 'user') {
            this.router.navigate(['/']);
          } else if (res.token == 'admin') {
            this.router.navigate(['/manage']);
          }
        },
        error: (err) => (this.errorMessage = err.error.error),
      });
    }
  }
}
