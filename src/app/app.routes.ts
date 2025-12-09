import { Routes } from '@angular/router';

import { TopComponent } from './top/top.component';
import { loginComponent } from './login/login.component';
import { createUserComponent } from './create_user/create_user.component';
import { ManageTopComponent } from './manage_top/manage_top.component';
import { ManageUserComponent } from './manage_user/manage_user.component';
import { ManageUserCreateComponent } from './manage_user_create/manage_user_create.component';
import { ManageGernreComponent } from './manage_gernre/manage_gernre.component';
import { ManageGernreCreateComponent } from './manage_gernre_create/manage_gernre_create.component';
import { ManageQuestionComponent } from './manage_question/manage_question.component';
import { ManageQuestionCreateComponent } from './manage_question_create/manage_question_create.component';
import { ManageQuestionUploadComponent } from './manage_question_create copy/manage_question_create_upload.component';
import { questionComponent } from './question/question.component';
import { QuestionCompleteComponent } from './question_complete/question_complete.component';
import { ScoreComponent } from './score.component.ts/score.component';
import { ManageMarks } from './manage_marks/manage_marks.component';
import { AuthGuard } from './auth_guard/auth_guard';

export const routes: Routes = [
  { path: '', component: TopComponent },
  { path: 'login', component: loginComponent },
  { path: 'create_user', component: createUserComponent },
  { path: 'question', component: questionComponent },
  { path: 'question/complete', component: QuestionCompleteComponent },
  { path: 'score', component: ScoreComponent },

  { path: 'manage', component: ManageTopComponent, canActivate: [AuthGuard] },
  { path: 'manage/user', component: ManageUserComponent, canActivate: [AuthGuard] },
  { path: 'manage/user/create', component: ManageUserCreateComponent, canActivate: [AuthGuard] },
  { path: 'manage/gernre', component: ManageGernreComponent, canActivate: [AuthGuard] },
  {
    path: 'manage/gernre/create',
    component: ManageGernreCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'manage/gernre/create/edit/:id',
    component: ManageGernreCreateComponent,
    canActivate: [AuthGuard],
  },
  { path: 'manage/question', component: ManageQuestionComponent, canActivate: [AuthGuard] },
  {
    path: 'manage/question/create',
    component: ManageQuestionCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'manage/questions/create',
    component: ManageQuestionUploadComponent,
    canActivate: [AuthGuard],
  },
  { path: 'manage/marks', component: ManageMarks, canActivate: [AuthGuard] },
];

// , canActivate: [AuthGuard]
