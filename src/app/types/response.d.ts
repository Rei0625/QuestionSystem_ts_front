export type UserType = {
  user_id: string;
  admin_id: number;
  user_name: string;
  password: string;
  email: string;
  del_flg?: number | null;
  create_user?: string | null;
  create_date?: string | null;
  update_user?: string | null;
  update_date?: string | null;
};

export type LoginRequestType = {
  email: string;
  password: string;
};

export type LoginResponseType = {
  token: string;
  user: UserType;
};

export type GetUserResponseType = {
  token: string;
  message: string;
  users: User[];
};

export type UploadUsersType = {
  admin_id: number;
  user_name: string;
  email: string;
};

export type ExamgroupsResponseType = {
  token: string;
  examgroups: Examgroup[];
};

export type ExamGroupType = {
  examgroup_id: string;
  examgroup_name: string;
  del_flg?: number | null;
  categorys: CategoryType[] | null;
};

export type CategoryType = {
  category_id: string;
  category_examgroup_id: string;
  category_name: string;
  del_flg?: number | null;
  questions: QuestionType[] | null;
};

export type GetGernresResponseType = {
  token: string;
  message: string;
  gernres: ExamGroupType[];
};

export type GetExamgroupsResponseType = {
  token: string;
  message: string;
  examgroups: ExamGroupType[];
};

export type QuestionType = {
  question_id: string;
  question_category_id: string;
  question_memo: string;
  option_type: string;
  question_option: string;
  question_radio_answer: number | null;
  question_checkbox_answer: string | null;
  question_code: string;
  del_flg: number | null;
};

export type QuestionDataType = {
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
};

export type QuestionDataResponseType = {
  question_data: QuestionDataType | null;
};

export type AnswerType = {
  answer_id: string;
  answer_user_id: string;
  answer_question_id: string;
  answer: string;
  answer_flg: boolean;
  answer_examgroup_name: string;
  answer_category_name: string;
  answer_score: number | null;
};

export type AnswerDataType = {
  answers: AnswerType[] | null;
};
