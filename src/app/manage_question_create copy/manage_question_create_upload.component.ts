import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-Top',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './manage_question_create_upload.component.html',
  styleUrls: ['./manage_question_create_upload.component.css'],
})
export class ManageQuestionUploadComponent {
  questions: any[] = [];
  back_adress = environment.apiUrl;
  errorMessage: String = '';
  resultMessages: any[] = [];

  constructor(private router: Router, private http: HttpClient) {}

  navigateToQuestion() {
    this.router.navigate(['/manage/question']);
  }

  // ファイル選択時の処理
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.readFile(file);
  }

  // ドラッグ＆ドロップでファイルがドロップされた時
  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files.length) {
      const file = event.dataTransfer.files[0];
      this.readFile(file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
  }

  // ファイル読み込みとパース処理
  readFile(file: File): void {
    const reader = new FileReader();

    if (file.name.endsWith('.csv')) {
      reader.onload = (e) => {
        const text = reader.result as string;
        this.parseCsv(text);
      };
      reader.readAsText(file);
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      reader.onload = (e) => {
        const data = new Uint8Array(reader.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        this.parseJson(jsonData);
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert('CSV または Excel ファイルを選択してください。');
    }
  }

  // CSVテキストを配列にパース
  parseCsv(csvText: string): void {
    const lines = csvText.split(/\r\n|\n/);
    const headers = lines[0].split(',');

    const result: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i]) continue;
      const obj: any = {};
      const currentline = lines[i].split(',');

      for (let j = 0; j < headers.length; j++) {
        obj[headers[j].trim()] = currentline[j]?.trim() || '';
      }
      result.push(obj);
    }

    this.parseJson(result);
  }

  // JSON配列をquestionsにセット（文字列配列などはカンマ区切りのまま保持）
  parseJson(data: any[]): void {
    this.questions = data.map((item) => ({
      question_category_id: item['question_category_id'] || '',
      question_memo: item['question_memo'] || '',
      option_type: item['option_type'] || 'radiobutton',

      question_option: Array.isArray(item['question_option'])
        ? item['question_option'].map((v: string) => v.trim())
        : typeof item['question_option'] === 'string'
        ? item['question_option'].split(',/').map((v: string) => v.trim())
        : [],

      question_radio_answer: item['question_radio_answer']
        ? Number(item['question_radio_answer'])
        : null,

      question_checkbox_answer: (() => {
        const raw = item['question_checkbox_answer'];

        if (Array.isArray(raw)) {
          return raw.map((v) => {
            if (typeof v === 'boolean') return v;
            if (typeof v === 'string') return v.trim().toLowerCase() === 'true';
            return false;
          });
        }

        if (typeof raw === 'string') {
          return raw.split(',').map((v) => v.trim().toLowerCase() === 'true');
        }

        return [];
      })(),

      question_code: item['question_code'] || '',
    }));
  }

  registerQuestions(): void {
    this.parseJson(this.questions);
    const body = {
      questions: this.questions,
    };

    this.http
      .post<{ result: any[] }>(this.back_adress + 'manage/question_create/upload', body)
      .subscribe({
        next: (res) => {
          console.log(res);
          const count = 0;
          for (const result of res.result) {
            if ('result' in result) {
              this.questions.splice(count, 1);
              continue;
            }
            this.resultMessages.push(result.error);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        error: (err) => (this.errorMessage = err.error.error),
      });
    console.log('登録データ', this.questions);
  }
}
