import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { cookieService } from '../service/cookieService';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Answer, AnswerDataResponse } from '../models/model';
import * as _ from 'lodash';

@Component({
  selector: 'app-Top',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './score.manage.component.html',
  styleUrls: ['./score.manage.component.css'],
})
export class ScoreManageComponent {
  back_adress = environment.apiUrl;
  isActive: boolean = false;
  userActive: boolean = false;
  user_name: String = '';
  user_id: String = '';
  password: String = '';
  password_confirm: String = '';
  now_password: String = '';
  errorMessage: String = '';
  resultMessage: String = '';
  answers: Answer[] = [];
  score_collect: Record<string, Record<string, Answer[]>> = {};
  examgroup_score: Record<string, number> = {};
  category_score: Record<string, Record<string, number>> = {};

  constructor(private router: Router, private cookie: cookieService, private http: HttpClient) {
    this.getUser();
    this.getScore();
  }

  getUser() {
    this.user_name = this.cookie.Login_get_name_cokkie();
    this.user_id = this.cookie.Login_get_cokkie();
    if (this.user_name == '') {
      this.userActive = false;
      return;
    }
    this.userActive = true;
  }

  navigateToTop(): void {
    this.router.navigate(['/']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToManageTop() {
    this.router.navigate(['/manage']);
  }

  clickPasswordChange() {
    this.isActive = true;
  }

  reset() {
    this.password = '';
    this.password_confirm = '';
    this.now_password = '';
  }

  changePassword() {
    this.errorMessage = '';
    if (this.password != this.password_confirm) {
      this.errorMessage = 'パスワードが一致しません';
      return;
    }

    const body = {
      user_id: this.user_id,
      now_password: this.now_password,
      new_password: this.password,
    };

    this.http.post(this.back_adress + 'user/change_password', body).subscribe({
      next: (res) => {
        this.reset();
        this.resultMessage = 'パスワードを変更しました';
        this.isActive = false;
        setTimeout(() => {
          this.resultMessage = '';
        }, 3000);
      },
      error: (err) => (this.errorMessage = err.error.error),
    });
  }

  getScore() {
    if (this.user_id == '') {
      const guest_user_id = this.cookie.Login_question_get_cokkie();
      const body = {
        guest_user_id: guest_user_id,
      };
      this.http
        .post<AnswerDataResponse>(this.back_adress + 'user/get_guest_score', body)
        .subscribe({
          next: (res) => {
            if (res.answers) {
              this.answers = res.answers;
              this.collectScore();
            }
          },
          error: (err) => (this.errorMessage = err.error.error),
        });
      return;
    }
    const body = {
      user_id: this.user_id,
    };
    this.http.post<AnswerDataResponse>(this.back_adress + 'user/get_score', body).subscribe({
      next: (res) => {
        if (res.answers) {
          this.answers = res.answers;
          this.collectScore();
        }
      },
      error: (err) => (this.errorMessage = err.error.error),
    });
  }

  collectScore() {
    this.score_collect = _.mapValues(
      _.groupBy(this.answers, 'answer_examgroup_name'),
      (examgroup_items) => _.groupBy(examgroup_items, 'answer_category_name')
    );
    console.log(this.score_collect);
    for (const examgroup_key in this.score_collect) {
      let e_score = 0;
      let e_count = 0;
      this.category_score[examgroup_key] = {};
      for (const category_key in this.score_collect[examgroup_key]) {
        const c_score = Object.values(this.score_collect[examgroup_key][category_key]).filter(
          (value) => value.answer_flg == true
        ).length;
        const c_count = this.score_collect[examgroup_key][category_key].length;
        this.category_score[examgroup_key][category_key] = Math.ceil((c_score / c_count) * 100);
        console.log(this.category_score);
        e_score += c_score;
        e_count += c_count;
      }
      this.examgroup_score[examgroup_key] = Math.ceil((e_score / e_count) * 100);
    }
  }
}
