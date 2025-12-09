import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { cookieService } from '../service/cookieService';
import { QuestionData } from '../models/model';
import { questionDataService } from '../service/questionDataService';
import { Subscription } from 'rxjs';
import { LoadingComponent } from '../part/loading/loading.component';
import { CorrectComponent } from '../part/correct/correct.component';
import { InCorrectComponent } from '../part/incorrect/incorrect.component';

@Component({
  selector: 'app-Top',
  standalone: true,
  imports: [FormsModule, LoadingComponent, CorrectComponent, InCorrectComponent],
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
})
export class questionComponent implements OnInit {
  errorMessage: String = '';
  back_adress = environment.apiUrl;
  active: String = 'checkbox';
  code_active: boolean = false;
  question_data: QuestionData | null = null;
  isLoading = true;
  subscription?: Subscription;
  radio_answer: String = '';
  check_answer: String[] = [];
  count: number = 1;
  user_radio_answer: String = '';
  user_check_answer: String[] = [];
  user_result: String[] = [];
  result: boolean | null = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private cookie: cookieService,
    private quest: questionDataService
  ) {}

  ngOnInit() {
    this.subscription = this.quest.questions$.subscribe((data) => {
      this.count = Number(sessionStorage.getItem('count'));
      console.log(data.question);
      if (data.question?.question_id == '0') {
        this.router.navigate(['question/complete']);
      }
      this.isLoading = false;
      this.check_answer = [];
      this.taskQuestion(data);
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  resetData() {
    this.code_active = false;
    this.result = null;
    this.user_result = [];
    this.check_answer = [];
    this.radio_answer = '';
    this.user_radio_answer = '';
    this.user_check_answer = [];
  }

  resetAnswerData() {
    this.user_check_answer = [];
    this.user_radio_answer = '';
  }

  displayCode() {
    this.code_active = true;
  }

  navigateToTop() {
    this.router.navigate(['/']);
  }

  navigateToScore() {
    this.router.navigate(['/score']);
  }

  taskQuestion(get_data: { question: QuestionData | null }) {
    if (get_data.question == null) {
      return;
    }
    const data: QuestionData = get_data.question;
    this.active = data.option_type;

    if (data.question_radio_answer !== null) {
      this.radio_answer = data.question_option[data.question_radio_answer - 1];
      console.log(this.radio_answer);
      this.questionshuffle(data);
    } else if (data.question_checkbox_answer !== null) {
      for (let i = 0; i < data.question_option.length; i++) {
        if (data.question_checkbox_answer[i] === true) {
          this.check_answer.push(data.question_option[i]);
        }
      }
      this.questionshuffle(data);
      console.log(this.check_answer);
    }
  }

  questionshuffle(data: QuestionData) {
    const arr = data.question_option;
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    this.question_data = data;
  }

  onCheckboxChange(event: Event, value: string) {
    const input = event.target as HTMLInputElement;

    if (input.checked) {
      if (!this.user_check_answer.includes(value)) {
        this.user_check_answer.push(value);
      }
    } else {
      this.user_check_answer = this.user_check_answer.filter((v) => v !== value);
    }
  }

  Answer() {
    if (this.question_data?.option_type == 'radiobutton') {
      if (this.user_radio_answer == '') {
        return;
      }
      this.radioAnswer();
    } else if (this.question_data?.option_type == 'checkbox') {
      if (this.user_check_answer.length == 0) {
        return;
      }
      this.checkboxAnswer();
    } else {
      this.errorMessage = 'エラー';
    }
    this.scrollAnswer();
  }

  scrollAnswer() {
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        left: 0,
        behavior: 'smooth',
      });
    }, 30);
  }

  radioAnswer() {
    console.log(this.user_radio_answer);
    if (this.radio_answer === this.user_radio_answer) {
      this.result = true;
      this.code_active = true;
      this.user_result.push(this.user_radio_answer);
      this.sendAnswer();
      this.resetAnswerData();
      return;
    }
    this.code_active = true;
    this.result = false;
    this.user_result.push(this.user_radio_answer);
    this.sendAnswer();
    this.resetAnswerData();
  }

  checkboxAnswer() {
    if (
      this.check_answer.length === this.user_check_answer.length &&
      this.check_answer.every((item) => this.user_check_answer.includes(item))
    ) {
      this.result = true;
      this.code_active = true;
      this.user_result = this.user_check_answer;
      this.resetAnswerData();
      this.sendAnswer();
    } else {
      this.code_active = true;
      this.result = false;
      this.user_result = this.user_check_answer;
      this.resetAnswerData();
      this.sendAnswer();
    }
  }

  nextQuestion() {
    this.count = this.count + 1;
    sessionStorage.setItem('count', this.count.toString());
    this.resetData();
    window.scrollTo(0, 0);
    this.quest.getQuestion();
  }

  sendAnswer() {
    const user_id = this.cookie.Login_get_cokkie();
    if (user_id == '') {
      const guest_user_id = this.cookie.Login_question_get_cokkie();
      const body = {
        answer_guest_user_id: guest_user_id,
        answer_question_id: this.question_data?.question_id,
        answer: this.user_result,
        answer_flg: this.result,
        answer_examgroup_name: this.question_data?.question_examgroup_name,
        answer_category_name: this.question_data?.question_category_name,
      };
      console.log(body);

      this.http.post(this.back_adress + 'user/guest_answer', body).subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => (this.errorMessage = err.error.error),
      });
    }
    const body = {
      answer_user_id: user_id,
      answer_question_id: this.question_data?.question_id,
      answer: this.user_result,
      answer_flg: this.result,
      answer_examgroup_name: this.question_data?.question_examgroup_name,
      answer_category_name: this.question_data?.question_category_name,
    };
    console.log(body);

    this.http.post(this.back_adress + 'user/answer', body).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => (this.errorMessage = err.error.error),
    });
  }
}
