import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UploadUsers } from '../models/model';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-Top',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './manage_user_create.component.html',
  styleUrls: ['./manage_user_create.component.css'],
})
export class ManageUserCreateComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  uploaded_users: UploadUsers[] = [];
  admin: String = '';
  admin_id = 30;
  user_name: String = '';
  email: String = '';
  password: String = '';
  password_confirm: String = '';
  errorMessage: String = '';
  resultsMessage: Array<{ user_name: string; message: string }> = [];
  back_adress = environment.apiUrl;

  constructor(private router: Router, private http: HttpClient) {}
  navigateToManageUser() {
    this.router.navigate(['/manage/user']);
  }

  create_user() {
    if (this.password != this.password_confirm) {
      this.errorMessage = 'パスワードが違います。';
      return;
    } else if (!this.user_name.trim() || !this.password.trim() || !this.email.trim()) {
      this.errorMessage = 'ユーザーネームとパスワード、メールアドレスを入力してください。';
      return;
    }
    if (this.admin == 'admin') {
      this.admin_id = 10;
    } else {
      this.admin_id = 20;
    }
    const body = {
      user_name: this.user_name,
      password: this.password,
      email: this.email,
      admin_id: this.admin_id,
    };

    this.back_adress = environment.apiUrl + 'user/create_user';
    this.http.post(this.back_adress, body).subscribe({
      next: (res) => this.router.navigate(['/manage/user']),
      error: (err) => (this.errorMessage = err.error.error),
    });
  }

  onUploadClick() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    this.parseFile(file);
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    if (!event.dataTransfer || !event.dataTransfer.files.length) return;
    const file = event.dataTransfer.files[0];
    this.parseFile(file);
  }

  parseFile(file: File) {
    const reader = new FileReader();
    const extension = file.name.split('.').pop()?.toLowerCase();

    reader.onload = (e) => {
      const data = e.target?.result;

      if (extension === 'csv') {
        this.parseCSV(data as string);
      } else if (extension === 'xlsx' || extension === 'xls') {
        this.parseExcel(data as ArrayBuffer);
      } else {
        alert('対応していないファイル形式です。CSVまたはExcelファイルをアップロードしてください。');
      }
    };

    if (extension === 'csv') {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  }

  parseCSV(csvText: string) {
    const lines = csvText.split('\n');
    this.uploaded_users = lines
      .map((line) => {
        const [admin_id, user_name, email] = line.split(',').map((s) => s.trim());
        if (!admin_id || !user_name || !email) return null;
        return { admin_id, user_name, email };
      })
      .filter(Boolean) as any[];
  }

  parseExcel(buffer: ArrayBuffer) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(sheet);

    this.uploaded_users = json.map((row: any) => ({
      admin_id: row['admin_id'] || row['権限'],
      user_name: row['user_name'] || row['名前'],
      email: row['email'] || row['メール'],
    }));
    console.log(this.uploaded_users);
  }

  bulkCreateUsers() {
    if (
      this.uploaded_users.some((user) => user.user_name === undefined || user.email === undefined)
    ) {
      this.errorMessage = 'ユーザーネームまたはメールアドレスが無効のユーザーがいます';
      return;
    } else {
      const body = {
        users: this.uploaded_users,
      };

      this.back_adress = environment.apiUrl + 'manage/create_users';
      this.http.post<any>(this.back_adress, body).subscribe({
        next: (res) => {
          console.log(res.results);
          this.resultsMessage = res.results;
        },
        error: (err) => (this.errorMessage = err.error.error),
      });
    }
  }
}
