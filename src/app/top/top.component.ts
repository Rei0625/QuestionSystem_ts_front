import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ExamGroup, GetGernresResponse } from '../models/model';
import { environment } from '../../environments/environment';
import { MatIconModule } from '@angular/material/icon';
import { cookieService } from '../service/cookieService';
import { questionDataService } from '../service/questionDataService';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-Top',
  standalone: true,
  imports: [FormsModule, CommonModule, MatIconModule],
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.css'],
})
export class TopComponent {
  activeSection: string = 'exam';
  back_adress = environment.apiUrl;
  errorMessage: String = '';
  gernres: ExamGroup[] = [];
  login_id: String = '';
  logout_select: boolean = false;
  showConfirmDialog: boolean = false;
  examgroup_select: String[] = [];
  category_select: String[] = [];
  category_examgroup_select: String[] = [];
  examexamgroup_select: String = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private cookie: cookieService,
    private questdata: questionDataService,
    private authService: AuthService
  ) {
    this.getGernres();
    this.cookieLoginGet();
    this.questdata.resetGernre();
  }

  logout() {
    this.cookie.Logout_cookie();
    this.cookieLoginGet();
  }

  cookieLoginGet() {
    this.login_id = this.cookie.Login_get_cokkie();
  }

  switchSection(sectionId: string): void {
    this.activeSection = sectionId;
    this.examgroup_select = [];
    this.category_select = [];
    this.examexamgroup_select = '';
    this.errorMessage = '';
  }

  isActive(sectionId: string): boolean {
    return this.activeSection === sectionId;
  }

  navigateToLogin(): void {
    console.log('ログイン画面');
    this.router.navigate(['/login']);
  }

  navigateToCreateUser(): void {
    console.log('ユーザー作成画面');
    this.router.navigate(['/create_user']);
  }

  navigateToScore() {
    this.router.navigate(['/score']);
    this.authService.verifyToken().subscribe({
      next: (res) => {
        if (res == false) {
          this.router.navigate(['/score']);
        } else if (res == true) {
          this.router.navigate(['/manage/manage_score']);
        }
      },
      error: (err) => {
        console.error('Token verification failed', err);
        this.router.navigate(['/']);
      },
    });
  }

  navigateToQuestion(): void {
    if (this.activeSection == 'exam') {
      if (this.examgroup_select.length === 0) {
        this.errorMessage = '試験科目を1つ以上選択してください';
        return;
      } else {
        this.questdata.selectExamGernre(this.examgroup_select);
        this.router.navigate(['/question']);
      }
    } else if (this.activeSection == 'field') {
      if (this.category_select.length === 0) {
        this.errorMessage = 'カテゴリーを1つ以上選択してください';
        return;
      } else {
        this.questdata.selectFieldGernre(this.category_select, this.category_examgroup_select);
        this.router.navigate(['/question']);
      }
    } else if (this.activeSection == 'mock') {
      if (this.examexamgroup_select == '') {
        this.errorMessage = '試験科目を選択してください';
        return;
      } else {
        this.questdata.selectMockGernre(this.examexamgroup_select);
        this.router.navigate(['/question']);
      }
    } else {
      this.errorMessage = 'エラーが発生しましたやり直してください';
      return;
    }
  }

  confirmDelete() {
    this.logout_select = true;
    this.showConfirmDialog = true;
  }

  deleteConfirmed() {
    if (this.logout_select) {
      this.logout();
    }
    this.showConfirmDialog = false;
    this.logout_select = false;
  }

  cancelDelete() {
    this.showConfirmDialog = false;
    this.logout_select = false;
  }

  ExamgroupToggleSelect(examgroup_id: String, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      console.log();
      if (!this.examgroup_select.includes(examgroup_id)) {
        this.examgroup_select.push(examgroup_id);
      }
    } else {
      this.examgroup_select = this.examgroup_select.filter((x) => x !== examgroup_id);
    }
    console.log(this.examgroup_select);
  }

  CategoryToggleSelect(category_id: String, examgroup_id: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      if (!this.category_select.includes(category_id)) {
        this.category_select.push(category_id);
        if ((document.getElementById(examgroup_id) as HTMLInputElement).checked == false) {
          (document.getElementById(examgroup_id) as HTMLInputElement).checked = true;
          this.category_examgroup_select.push(examgroup_id);
        }
      }
    } else {
      const elements = document.querySelectorAll<HTMLInputElement>('.data-' + examgroup_id);
      this.category_select = this.category_select.filter((x) => x !== category_id);
      if (Array.from(elements).every((input) => !input.checked)) {
        (document.getElementById(examgroup_id) as HTMLInputElement).checked = false;
        this.category_examgroup_select = this.category_examgroup_select.filter(
          (x) => x !== examgroup_id
        );
      }
    }
    console.log(this.category_select);
  }

  ExamSelect(event: Event) {
    const element = (event.target as HTMLInputElement).value;
    this.examexamgroup_select = element;
    console.log(this.examexamgroup_select);
  }

  checkGroup(examgroup_id: string) {
    console.log(document.querySelectorAll('.data-' + examgroup_id));
    const elements = document.querySelectorAll('.data-' + examgroup_id);
    const element = document.getElementById(examgroup_id);
    if (element instanceof HTMLInputElement && element.type == 'checkbox') {
      elements.forEach((type) => {
        if (type instanceof HTMLInputElement && type.type == 'checkbox') {
          if (element.checked) {
            type.checked = true;
            if (!this.category_select.includes(type.id)) {
              this.category_examgroup_select.push(examgroup_id);
              this.category_select.push(type.id);
            }
          } else {
            type.checked = false;
            this.category_select = this.category_select.filter((x) => x !== type.id);
            this.category_examgroup_select = this.category_examgroup_select.filter(
              (x) => x !== examgroup_id
            );
          }
        }
      });
      console.log(this.category_select);
    }
  }

  getGernres() {
    this.http
      .get<GetGernresResponse>(this.back_adress + 'manage/gernres_get', { withCredentials: true })
      .subscribe({
        next: (res) => {
          console.log(res);
          this.gernres = res.gernres;
          console.log(this.gernres);
        },
        error: (err) => (this.errorMessage = err.error.error),
      });
  }
}
