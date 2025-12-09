import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { Category, ExamGroup, GetGernresResponse, Question } from '../models/model';

@Component({
  selector: 'app-Top',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './manage_question_create.component.html',
  styleUrls: ['./manage_question_create.component.css'],
})
export class ManageQuestionCreateComponent {
  numbers = Array.from({ length: 10 }, (_, i) => i + 1);
  editActive: boolean = false;
  option_type: String = '';
  counts: number[] = [];
  count: number | null = null;
  back_adress = environment.apiUrl;
  gernres: ExamGroup[] = [];
  select_gernre: ExamGroup | undefined;
  select_category: Category | undefined;
  errorMessage: String = '';
  createMessage: String = '';
  question_text: String = '';
  question_code: String = '';
  radio_answer_index: number | null = null;
  checkbox_answer: boolean[] = [];
  question_option: String[] = [];
  question_data: Question | null = null;
  category_to_examgroupmap = new Map<String, ExamGroup>();

  constructor(private router: Router, private http: HttpClient) {
    if (history.state.question) {
      this.EditgetGernres();
      this.question_data = history.state.question;
    } else {
      this.getGernres();
    }
  }

  navigateToQuestion() {
    this.router.navigate(['/manage/question']);
  }

  navigateToQuestionsCreate() {
    this.router.navigate(['/manage/questions/create']);
  }

  GernreMap() {
    for (const examgroup of this.gernres) {
      if (examgroup.categorys) {
        for (const category of examgroup.categorys) {
          this.category_to_examgroupmap.set(category.category_id, examgroup);
        }
      }
    }
    this.editSetQuestion();
    console.log(this.category_to_examgroupmap);
  }

  getGernres() {
    this.http.get<GetGernresResponse>(this.back_adress + 'manage/gernres_get').subscribe({
      next: (res) => {
        this.gernres = res.gernres;
      },
      error: (err) => (this.errorMessage = err.error.error),
    });
  }

  EditgetGernres() {
    this.http.get<GetGernresResponse>(this.back_adress + 'manage/gernres_get').subscribe({
      next: (res) => {
        this.gernres = res.gernres;
        this.GernreMap();
      },
      error: (err) => (this.errorMessage = err.error.error),
    });
  }

  editSetQuestion() {
    this.editActive = true;
    if (this.question_data?.option_type == 'radiobutton') {
      this.select_gernre = this.category_to_examgroupmap.get(
        this.question_data.question_category_id
      );
      this.select_category = this.select_gernre?.categorys?.find(
        (item) => item.category_id == this.question_data?.question_category_id
      );
      this.question_text = this.question_data.question_memo;
      this.option_type = this.question_data.option_type;
      this.question_option = JSON.parse(this.question_data.question_option);
      this.count = this.question_option.length;
      this.radio_answer_index = this.question_data.question_radio_answer;
      this.selectToOption_count(this.count);
      this.question_code = this.question_data.question_code;
      console.log(this.count);
    } else if (this.question_data?.option_type == 'checkbox') {
      this.select_gernre = this.category_to_examgroupmap.get(
        this.question_data.question_category_id
      );
      this.select_category = this.select_gernre?.categorys?.find(
        (item) => item.category_id == this.question_data?.question_category_id
      );
      this.question_text = this.question_data.question_memo;
      this.option_type = this.question_data.option_type;
      this.question_option = JSON.parse(this.question_data.question_option);
      this.count = this.question_option.length;
      this.selectToOption_count(this.count);
      this.checkbox_answer = this.question_data.question_checkbox_answer
        ? JSON.parse(this.question_data.question_checkbox_answer)
        : [];
      this.question_code = this.question_data.question_code;
    }
  }

  selectToExamgroup(examgroup: ExamGroup) {
    this.select_gernre = examgroup;
  }

  selectToOption_type(option: string) {
    this.option_type = option;
  }

  selectToOption_count(count: number) {
    this.counts = Array.from({ length: count }, (_, i) => i + 1);
    this.counts.forEach((count) => {
      this.checkbox_answer[count - 1] = false;
    });
    this.count = count;
  }

  createQuestion() {
    this.errorMessage = '';
    if (!this.question_text.trim() || !this.question_code.trim()) {
      this.errorMessage = '問題文、もしくは解説が入力されていません。';
      return;
    }

    if (
      this.question_option.some((opt) => opt.trim() === '') ||
      this.question_option.length === 0
    ) {
      this.errorMessage = 'すべての選択肢を入力してください。';
      return;
    }

    if (!this.select_category || !this.select_gernre || !this.option_type?.trim() || !this.count) {
      this.errorMessage = '選択していない項目があります。すべて選択してください。';
      return;
    }

    if (this.option_type == 'radiobutton') {
      if (this.radio_answer_index == null) {
        this.errorMessage = '回答を選択してください';
        return;
      }
      this.createRadiobuttonQuestion();
      return;
    } else if (this.option_type == 'checkbox') {
      if (
        this.checkbox_answer.every((value) => value === false) ||
        this.checkbox_answer.length == 0
      ) {
        this.errorMessage = '回答を選択してください';
        return;
      }
      this.createCheckboxQuestion();
      return;
    } else {
      this.errorMessage = '回答を選択してください';
    }
  }

  createRadiobuttonQuestion() {
    const body = {
      question_category_id: this.select_category!.category_id,
      question_memo: this.question_text,
      option_type: this.option_type,
      question_option: this.question_option,
      question_radio_answer: this.radio_answer_index,
      question_code: this.question_code,
    };

    console.log(body);

    this.http.post(this.back_adress + 'manage/question/radiobutton_create', body).subscribe({
      next: (res) => {
        this.createMessage = '試験科目が作成されました';
        this.question_text = '';
        this.question_code = '';
        this.radio_answer_index = null;
        this.checkbox_answer = [];
        this.question_option = [];
      },
      error: (err) => (this.errorMessage = err.error.error),
    });
  }

  createCheckboxQuestion() {
    const body = {
      question_category_id: this.select_category!.category_id,
      question_memo: this.question_text,
      option_type: this.option_type,
      question_option: this.question_option,
      question_checkbox_answer: this.checkbox_answer,
      question_code: this.question_code,
    };

    console.log(body);

    this.http.post(this.back_adress + 'manage/question/checkbox_create', body).subscribe({
      next: (res) => {
        this.createMessage = '試験科目が作成されました';
        this.question_text = '';
        this.question_code = '';
        this.radio_answer_index = null;
        this.checkbox_answer = [];
        this.question_option = [];
      },
      error: (err) => (this.errorMessage = err.error.error),
    });
  }

  EditQuestion() {
    this.errorMessage = '';
    if (!this.question_text.trim() || !this.question_code.trim()) {
      this.errorMessage = '問題文、もしくは解説が入力されていません。';
      return;
    }

    if (
      this.question_option.some((opt) => opt.trim() === '') ||
      this.question_option.length === 0
    ) {
      this.errorMessage = 'すべての選択肢を入力してください。';
      return;
    }

    if (!this.select_category || !this.select_gernre || !this.option_type?.trim() || !this.count) {
      this.errorMessage = '選択していない項目があります。すべて選択してください。';
      return;
    }

    if (this.option_type == 'radiobutton') {
      if (this.radio_answer_index == null) {
        this.errorMessage = '回答を選択してください';
        return;
      }
      this.EditRadiobuttonQuestion();
      return;
    } else if (this.option_type == 'checkbox') {
      if (
        this.checkbox_answer.every((value) => value === false) ||
        this.checkbox_answer.length == 0
      ) {
        this.errorMessage = '回答を選択してください';
        return;
      }
      this.EditCheckboxQuestion();
      return;
    } else {
      this.errorMessage = '回答を選択してください';
    }
  }

  EditRadiobuttonQuestion() {
    const body = {
      question_id: this.question_data!.question_id,
      question_category_id: this.select_category!.category_id,
      question_memo: this.question_text,
      option_type: this.option_type,
      question_option: this.question_option,
      question_radio_answer: this.radio_answer_index,
      question_code: this.question_code,
    };

    console.log(body);

    this.http
      .post<{ message: String }>(this.back_adress + 'manage/question/radiobutton_edit', body)
      .subscribe({
        next: (res) => {
          this.router.navigate(['/manage/question'], { state: { message: res.message } });
        },
        error: (err) => (this.errorMessage = err.error.error),
      });
  }

  EditCheckboxQuestion() {
    const body = {
      question_id: this.question_data!.question_id,
      question_category_id: this.select_category!.category_id,
      question_memo: this.question_text,
      option_type: this.option_type,
      question_option: this.question_option,
      question_checkbox_answer: this.checkbox_answer,
      question_code: this.question_code,
    };

    console.log(body);

    this.http
      .post<{ message: String }>(this.back_adress + 'manage/question/checkbox_edit', body)
      .subscribe({
        next: (res) => {
          this.router.navigate(['/manage/question'], { state: { message: res.message } });
        },
        error: (err) => (this.errorMessage = err.error.error),
      });
  }
}
