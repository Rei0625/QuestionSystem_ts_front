import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ExamGroup, ExamgroupsResponse, GetExamgroupsResponse } from '../models/model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-Top',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './manage_gernre_create.component.html',
  styleUrls: ['./manage_gernre_create.component.css'],
})
export class ManageGernreCreateComponent {
  back_adress = environment.apiUrl;
  examgroups: ExamGroup[] = [];
  errorExamgroupMessage: String = '';
  examgroup_name: String = '';
  createExamMessage: String = '';
  errorCategoryMessage: String = '';
  category_id: String = '';
  category_name: String = '';
  category_examgroup_id: String = '';
  createCategoryMessage: String = '';
  isActive: String = 'false';
  edit_examgroup_data: ExamGroup | null = null;
  edit_category_data: ExamGroup | null = null;

  constructor(private router: Router, private http: HttpClient) {
    this.getExamgroup();
    this.editCheck();
  }

  getExamgroup() {
    this.http.get<GetExamgroupsResponse>(this.back_adress + 'manage/examgroups_get').subscribe({
      next: (res) => {
        this.examgroups = res.examgroups;
      },
      error: (err) => (this.errorExamgroupMessage = err.error.error),
    });
  }

  editCheck() {
    if (history.state.examgroup == undefined) {
      this.isActive = 'false';
    } else {
      if (history.state.edit == 'examgroup') {
        this.isActive = 'examgroup';
        this.edit_examgroup_data = history.state.examgroup;
        this.editSetExamgroup();
      } else {
        this.isActive = 'category';
        this.edit_category_data = history.state.examgroup;
        this.editSetCategory();
      }
    }
  }

  navigateToGernre() {
    this.router.navigate(['/manage/gernre']);
  }

  create_examgroup(): void {
    console.log('試験科目作成開始');
    this.errorExamgroupMessage = '';
    this.createExamMessage = '';
    this.createCategoryMessage = '';
    if (!this.examgroup_name.trim()) {
      this.errorExamgroupMessage = '試験科目を入力してください';
      return;
    } else {
      const body = {
        examgroup_name: this.examgroup_name,
      };

      this.http.post(this.back_adress + 'manage/examgroup_create', body).subscribe({
        next: (res) => {
          this.createExamMessage = '試験科目が作成されました';
          this.examgroup_name = '';
          this.getExamgroup();
        },
        error: (err) => (this.errorExamgroupMessage = err.error.error),
      });
    }
  }

  create_category(): void {
    console.log('分野作成開始');
    this.errorCategoryMessage = '';
    this.createCategoryMessage = '';
    this.createExamMessage = '';
    if (!this.category_examgroup_id.trim()) {
      this.errorCategoryMessage = '所属試験科目を選択してください';
      return;
    } else if (!this.category_name.trim()) {
      this.errorCategoryMessage = 'カテゴリーを入力してください';
      this.category_examgroup_id = '';
      return;
    } else {
      const body = {
        category_name: this.category_name,
        category_examgroup_id: this.category_examgroup_id,
      };

      this.http.post(this.back_adress + 'manage/category_create', body).subscribe({
        next: (res) => {
          this.createCategoryMessage = '分野が作成されました';
          this.category_name = '';
        },
        error: (err) => (this.errorCategoryMessage = err.error.error),
      });
    }
  }

  editSetExamgroup() {
    this.examgroup_name = this.edit_examgroup_data ? this.edit_examgroup_data.examgroup_name : '';
  }
  editSetCategory() {
    this.category_examgroup_id = this.edit_category_data
      ? this.edit_category_data.examgroup_id
      : '';
    this.category_name = this.edit_category_data?.categorys?.[0]?.category_name ?? '';
    this.category_id = this.edit_category_data?.categorys?.[0]?.category_id ?? '';
  }
  editExamgroup() {
    this.errorExamgroupMessage = '';
    this.createExamMessage = '';
    this.createCategoryMessage = '';
    if (!this.examgroup_name.trim()) {
      this.errorExamgroupMessage = '試験科目を入力してください';
      return;
    } else {
      const body = {
        examgroup_id: this.edit_examgroup_data?.examgroup_id,
        examgroup_name: this.examgroup_name,
      };

      this.http
        .post<{ message: String }>(this.back_adress + 'manage/examgroup_edit', body)
        .subscribe({
          next: (res) => {
            console.log(res.message);
            this.router.navigate(['/manage/gernre'], { state: { message: res.message } });
          },
          error: (err) =>
            this.router.navigate(['/manage/gernre'], { state: { message: err.error.error } }),
        });
    }
  }
  editCategory() {
    this.errorCategoryMessage = '';
    this.createCategoryMessage = '';
    this.createExamMessage = '';
    if (!this.category_examgroup_id.trim()) {
      this.errorCategoryMessage = '所属試験科目を選択してください';
      return;
    } else if (!this.category_name.trim()) {
      this.errorCategoryMessage = 'カテゴリーを入力してください';
      return;
    } else {
      const body = {
        category_id: this.category_id,
        category_name: this.category_name,
        category_examgroup_id: this.category_examgroup_id,
      };

      this.http.post(this.back_adress + 'manage/category_edit', body).subscribe({
        next: (res) => {},
        error: (err) => (this.errorCategoryMessage = err.error.error),
      });
    }
  }
}
