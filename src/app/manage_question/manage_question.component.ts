import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { Category, ExamGroup, GetGernresResponse, Question, QuestionData } from '../models/model';

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
  selected_gernre: ExamGroup[] | undefined;
  JSON = JSON;
  showConfirmDialog = false;
  select_question_id: String = '';
  resultMessage: String = '';
  select_gernre: ExamGroup | undefined;
  select_category: Category | undefined;
  serch_text: String = '';

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
        this.selected_gernre = res.gernres;
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

  selectToExamgroup(examgroup: ExamGroup) {
    this.select_gernre = examgroup;
  }

  filterQuestions() {
    if (!this.select_gernre) return;

    // 選択された試験項目をコピーして selected_gernre に入れる
    this.selected_gernre = [
      {
        ...this.select_gernre,
        categorys: this.select_gernre.categorys ? [...this.select_gernre.categorys] : [],
      },
    ];

    // select_category が選ばれている場合だけ絞り込み
    if (this.select_category && this.selected_gernre[0].categorys) {
      this.selected_gernre[0].categorys = this.selected_gernre[0].categorys.filter(
        (category) => category.category_id === this.select_category!.category_id
      );
    }
  }

  resetFilter() {
    this.selected_gernre = this.gernres;
    this.select_gernre = undefined;
    this.select_category = undefined;
  }
}
