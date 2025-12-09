import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class cookieService {
  constructor(private cookie: CookieService) {}

  Login_cookie(user_id: string, user_name: string): void {
    this.cookie.set('user_id', user_id, 2 / 24, '/');
    this.cookie.set('user_name', user_name, 2 / 24, '/');
  }
  Login_get_cokkie(): String {
    return this.cookie.get('user_id');
  }

  Login_get_name_cokkie(): String {
    return this.cookie.get('user_name');
  }

  Login_question_get_cokkie(): String {
    const user_id = this.cookie.get('user_id');
    let guest_user_id = this.cookie.get('guest_user_id');
    if (user_id == '' && guest_user_id == '') {
      guest_user_id = Date.now().toString();
      this.cookie.set('guest_user_id', guest_user_id, 24, '/');
      return guest_user_id;
    } else if (user_id == '') {
      return guest_user_id;
    }
    return user_id;
  }
  Login_get_guest_id_cookie(): String {
    return this.cookie.get('guest_user_id');
  }
  Logout_cookie(): void {
    this.cookie.delete('user_id', '/');
    this.cookie.delete('user_name', '/');
  }
  Delete_guest_cookie(): void {
    this.cookie.delete('guest_user_id');
  }
}
