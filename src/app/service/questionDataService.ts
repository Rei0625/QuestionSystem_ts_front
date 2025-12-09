import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ExamGroup, ExamgroupsResponse, QuestionData, QuestionDataResponse } from '../models/model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { cookieService } from './cookieService';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class questionDataService {
  setting: String = '';
  examselect_gernre: String[] = [];
  fieldselect_gernre: String[] = [];
  category_examgroup_select: String[] = [];
  mockselect_gernre: String = '';
  examgroups: ExamGroup[] = [];
  questions_data: QuestionData[] = [];
  key_questions_id: String[] = [];
  errorMessage: String = '';
  back_adress = environment.apiUrl;
  private questionSubject = new BehaviorSubject<{
    question: QuestionData | null;
  }>({ question: null });
  public questions$ = this.questionSubject.asObservable();

  constructor(private http: HttpClient, private cookie: cookieService, private router: Router) {}
  selectSetting(set: String) {
    this.setting = set;
  }

  selectExamGernre(examselect_gernre: String[]) {
    this.examselect_gernre = examselect_gernre;
    this.getExamQuestions();
  }
  selectFieldGernre(fieldselect_gernre: String[], category_examgroup_select: String[]) {
    this.fieldselect_gernre = fieldselect_gernre;
    this.category_examgroup_select = category_examgroup_select;
    this.getFieldQuestions();
  }
  selectMockGernre(mockselect_gernre: String) {
    this.mockselect_gernre = mockselect_gernre;
    this.getMockQuestions();
  }

  resetSetting() {
    this.setting = '';
  }

  resetGernre() {
    this.examselect_gernre = [];
    this.fieldselect_gernre = [];
    this.mockselect_gernre = '';
    this.questions_data = [];
    this.key_questions_id = [];
    this.resetSubscribe();
    sessionStorage.clear();
    sessionStorage.setItem('count', '1');
    const body = {
      user_id: this.cookie.Login_question_get_cokkie(),
    };
    this.http.post(this.back_adress + 'redis/clear', body).subscribe({
      next: (res) => {},
      error: (err) => (this.errorMessage = err.error.error),
    });
  }

  getExamQuestions() {
    const body = {
      exams: this.examselect_gernre,
      user_id: this.cookie.Login_question_get_cokkie(),
    };
    this.http.post(this.back_adress + 'user/exam_questions_get', body).subscribe({
      next: (res) => this.getQuestion(),
      error: (err) => (this.errorMessage = err.error.error),
    });
  }

  getFieldQuestions() {
    const body = {
      field: this.fieldselect_gernre,
      field_select: this.category_examgroup_select,
      user_id: this.cookie.Login_question_get_cokkie(),
    };
    this.http.post(this.back_adress + 'user/field_questions_get', body).subscribe({
      next: (res) => this.getQuestion(),
      error: (err) => (this.errorMessage = err.error.error),
    });
  }

  getMockQuestions() {
    const body = {
      examgroup_id: this.mockselect_gernre,
      user_id: this.cookie.Login_question_get_cokkie(),
    };
    this.http.post(this.back_adress + 'user/mock_questions_get', body).subscribe({
      next: (res) => this.getQuestion(),
      error: (err) => (this.errorMessage = err.error.error),
    });
  }

  getQuestion() {
    const body = {
      user_id: this.cookie.Login_question_get_cokkie(),
    };
    this.http
      .post<QuestionDataResponse>(this.back_adress + 'redis/questions_data_get', body)
      .subscribe({
        next: (res) => {
          let question_data = res.question_data;
          console.log(question_data);
          if (question_data == null) {
            question_data = this.finQuestion();
          }
          this.questionSubject.next({ question: question_data });
        },
        error: (err) => (this.errorMessage = err.error.error),
      });
  }

  resetSubscribe() {
    this.questionSubject.next({ question: null });
  }

  finQuestion() {
    return {
      question_id: '0',
      question_category_id: '0',
      question_memo: '0',
      option_type: '0',
      question_option: [],
      question_radio_answer: 0,
      question_checkbox_answer: [],
      question_code: '0',
      del_flg: 0,
      question_examgroup_name: '0',
      question_category_name: '0',
    };
  }
}
