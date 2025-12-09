import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NumberValueAccessor } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Answer, AnswerDataResponse, GetUserResponse, User } from '../models/model';
import { CommonModule } from '@angular/common';
import * as _ from 'lodash';

@Component({
  selector: 'app-Top',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './manage_marks.component.html',
  styleUrls: ['./manage_marks.component.css'],
})
export class ManageMarks {
  back_adress = environment.apiUrl;
  isActive: boolean = false;
  user_name: String = '';
  user_id: String = '';
  errorMessage: String = '';
  resultMessage: String = '';
  answers: Answer[] = [];
  score_collect: Record<string, Record<string, Answer[]>> = {};
  examgroup_score: Record<string, number> = {};
  category_score: Record<string, Record<string, number>> = {};
  users: User[] | null = null;

  constructor(private router: Router, private http: HttpClient) {
    this.getUsers();
  }

  getUsers() {
    this.http.get<GetUserResponse>(this.back_adress + 'manage/user_get').subscribe({
      next: (res) => {
        this.users = res.users.filter((user) => user.admin_id !== 0 && user.admin_id !== 10);
      },
      error: (err) => (this.errorMessage = err.error.error),
    });
  }

  getScore(event: Event) {
    const user_id = (event.target as HTMLSelectElement).value;
    console.log(user_id);
    const body = {
      user_id: user_id,
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
        // this.category_score.push(Math.ceil((c_score / c_count) * 100));
        this.category_score[examgroup_key][category_key] = Math.ceil((c_score / c_count) * 100);
        console.log(this.category_score);
        e_score += c_score;
        e_count += c_count;
      }
      // this.examgroup_score.push(Math.ceil((e_score / e_count) * 100));
      this.examgroup_score[examgroup_key] = Math.ceil((e_score / e_count) * 100);
      console.log(this.examgroup_score);
    }
  }
}
