import type {
  UserType,
  LoginRequestType,
  LoginResponseType,
  GetUserResponseType,
  UploadUsersType,
  ExamGroupType,
  CategoryType,
  GetGernresResponseType,
  GetExamgroupsResponseType,
  QuestionType,
  ExamgroupsResponseType,
  QuestionDataType,
  QuestionDataResponseType,
  AnswerType,
} from '../types/response';

export class User {
  user_id: string;
  admin_id: number;
  user_name: string;
  password: string;
  email: string;
  del_flg?: number | null;

  constructor(data: UserType) {
    this.user_id = data.user_id;
    this.admin_id = data.admin_id;
    this.user_name = data.user_name;
    this.password = data.password;
    this.email = data.email;
    this.del_flg = data.del_flg ?? null;
  }
}

export class LoginRequest {
  email: string;
  password: string;

  constructor(data: LoginRequestType) {
    this.email = data.email;
    this.password = data.password;
  }
}

export class LoginResponse {
  token: string;
  user: User;

  constructor(data: LoginResponseType) {
    this.token = data.token;
    this.user = new User(data.user);
  }
}

export class GetUserResponse {
  token: string;
  message: String;
  users: User[];

  constructor(data: GetUserResponseType) {
    this.token = data.token;
    this.message = data.message;
    this.users = data.users;
  }
}

export class UploadUsers {
  admin_id: number;
  user_name: string;
  email: string;

  constructor(data: UploadUsersType) {
    this.admin_id = data.admin_id;
    this.user_name = data.user_name;
    this.email = data.email;
  }
}

export class ExamgroupsResponse {
  token: string;
  examgroups: ExamGroup[];

  constructor(data: ExamgroupsResponseType) {
    this.token = data.token;
    this.examgroups = data.examgroups;
  }
}

export class ExamGroup {
  examgroup_id: string;
  examgroup_name: string;
  del_flg?: number | null;
  categorys: Category[] | null;

  constructor(data: ExamGroupType) {
    this.examgroup_id = data.examgroup_id;
    this.examgroup_name = data.examgroup_name;
    this.del_flg = data.del_flg ?? null;
    this.categorys = data.categorys;
  }
}

export class Category {
  category_id: string;
  category_examgroup_id: string;
  category_name: string;
  del_flg?: number | null;
  questions: Question[] | null;

  constructor(data: CategoryType) {
    this.category_id = data.category_id;
    this.category_examgroup_id = data.category_examgroup_id;
    this.category_name = data.category_name;
    this.del_flg = data.del_flg ?? null;
    this.questions = data.questions;
  }
}

export class GetGernresResponse {
  token: string;
  message: String;
  gernres: ExamGroup[];

  constructor(data: GetGernresResponseType) {
    this.token = data.token;
    this.message = data.message;
    this.gernres = data.gernres;
  }
}

export class GetExamgroupsResponse {
  token: string;
  message: String;
  examgroups: ExamGroup[];

  constructor(data: GetExamgroupsResponseType) {
    this.token = data.token;
    this.message = data.message;
    this.examgroups = data.examgroups;
  }
}

export class Question {
  question_id: string;
  question_category_id: string;
  question_memo: string;
  option_type: string;
  question_option: string;
  question_radio_answer: number | null;
  question_checkbox_answer: string | null;
  question_code: string;
  del_flg: number | null;

  constructor(data: QuestionType) {
    this.question_id = data.question_id;
    this.question_category_id = data.question_category_id;
    this.question_memo = data.question_memo;
    this.option_type = data.option_type;
    this.question_option = data.question_option;
    this.question_radio_answer = data.question_radio_answer ?? null;
    this.question_checkbox_answer = data.question_checkbox_answer ?? null;
    this.question_code = data.question_code;
    this.del_flg = data.del_flg ?? null;
  }
}

export class QuestionData {
  question_id: string;
  question_category_id: string;
  question_memo: string;
  option_type: string;
  question_option: string[];
  question_radio_answer: number | null;
  question_checkbox_answer: boolean[] | null;
  question_code: string;
  del_flg: number | null;
  question_examgroup_name: string;
  question_category_name: string;

  constructor(data: QuestionDataType) {
    this.question_id = data.question_id;
    this.question_category_id = data.question_category_id;
    this.question_memo = data.question_memo;
    this.option_type = data.option_type;
    this.question_option = data.question_option;
    this.question_radio_answer = data.question_radio_answer ?? null;
    this.question_checkbox_answer = data.question_checkbox_answer ?? null;
    this.question_code = data.question_code;
    this.del_flg = data.del_flg ?? null;
    this.question_examgroup_name = data.question_examgroup_name;
    this.question_category_name = data.question_category_name;
  }
}

export class QuestionDataResponse {
  question_data: QuestionData | null;

  constructor(data: QuestionDataResponseType) {
    this.question_data = data.question_data;
  }
}

export class Answer {
  answer_id: string;
  answer_user_id: string;
  answer_question_id: string;
  answer: string;
  answer_flg: boolean;
  answer_examgroup_name: string;
  answer_category_name: string;
  answer_score: number | null;

  constructor(data: AnswerType) {
    this.answer_id = data.answer_id;
    this.answer_user_id = data.answer_user_id;
    this.answer_question_id = data.answer_question_id;
    this.answer = data.answer;
    this.answer_flg = data.answer_flg;
    this.answer_examgroup_name = data.answer_examgroup_name;
    this.answer_category_name = data.answer_category_name;
    this.answer_score = data.answer_score;
  }
}

export class AnswerDataResponse {
  answers: Answer[] | null;

  constructor(data: AnswerDataResponse) {
    this.answers = data.answers;
  }
}
