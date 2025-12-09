import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { ExamGroup, GetGernresResponse, Question, QuestionData } from '../models/model';

@Component({
  selector: 'app-Top',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './manage_question.component.html',
  styleUrls: ['./manage_question.component.css'],
})
export class ManageQuestionComponent {
  back_adress = environment.apiUrl;
  errorMessage: String = '';
  gernres: ExamGroup[] = [];
  JSON = JSON;
  showConfirmDialog = false;
  select_question_id: String = '';
  resultMessage: String = '';

  constructor(private router: Router, private http: HttpClient) {
    this.getQuestions();
    if (history.state.message) {
      this.resultMessage = history.state.message;
    }
  }

  navigateToQuestion() {
    this.router.navigate(['/manage/question/create']);
  }

  navigateToManageTop() {
    this.router.navigate(['/manage']);
  }

  getQuestions() {
    this.http.get<GetGernresResponse>(this.back_adress + 'manage/questions_get').subscribe({
      next: (res) => {
        console.log(res);
        this.gernres = res.gernres;
        console.log(this.gernres);
      },
      error: (err) => (this.errorMessage = err.error.error),
    });
  }

  confirmDelete(question_id: String) {
    this.select_question_id = question_id;
    this.showConfirmDialog = true;
  }

  deleteConfirmed() {
    if (this.select_question_id) {
      this.deleteQuestion(this.select_question_id);
    }
    this.showConfirmDialog = false;
    this.select_question_id = '';
  }

  cancelDelete() {
    this.showConfirmDialog = false;
    this.select_question_id = '';
  }

  deleteQuestion(question_id: String) {
    const body = {
      question_id: question_id,
    };

    this.http.post(this.back_adress + 'manage/delete_question', body).subscribe({
      next: (res) => {
        this.errorMessage = '削除しました';
        this.getQuestions();
      },
      error: (err) => {
        this.errorMessage = err.error.error;
      },
    });
  }

  editQuestion(question: Question) {
    this.router.navigate(['/manage/question/create'], { state: { question: question } });
  }
}
