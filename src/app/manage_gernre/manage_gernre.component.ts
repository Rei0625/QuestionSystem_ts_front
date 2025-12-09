import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Category, ExamGroup, GetGernresResponse } from '../models/model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-Top',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './manage_gernre.component.html',
  styleUrls: ['./manage_gernre.component.css'],
})
export class ManageGernreComponent {
  constructor(private router: Router, private http: HttpClient) {
    this.getGernres();
    if (history.state != undefined) {
      console.log(history.state);
      this.resultMessage = history.state.message;
    }
  }

  levels = ['examgroup', 'category', 'subcategory', 'type'] as const;
  selected_level: (typeof this.levels)[number] = 'examgroup';
  selected_examgroup: ExamGroup | null = null;
  selected_category: Category | null = null;
  errorMessage: String = '';
  back_adress = environment.apiUrl;
  openedNodes = new Set<number>();
  gernres: ExamGroup[] = [];
  showConfirmExamgroupDialog: boolean = false;
  showConfirmCategoryDialog: boolean = false;
  resultMessage: String = '';

  getGernres() {
    this.http.get<GetGernresResponse>(this.back_adress + 'manage/gernres_get').subscribe({
      next: (res) => {
        console.log(res);
        this.gernres = res.gernres;
        console.log(this.gernres);
      },
      error: (err) => (this.errorMessage = err.error.error),
    });
  }

  navigateToManageTop() {
    this.router.navigate(['/manage']);
  }

  navigateToManageGernreCreate() {
    this.router.navigate(['/manage/gernre/create']);
  }

  toggleNode(nodeID: string): void {
    const nodeId = Number(nodeID);
    if (this.openedNodes.has(nodeId)) {
      this.openedNodes.delete(nodeId);
      this.updateToggleIcon(nodeId, false);
    } else {
      this.openedNodes.add(nodeId);
      this.updateToggleIcon(nodeId, true);
    }
  }

  updateToggleIcon(nodeId: number, isOpen: boolean): void {
    const nodeElement = document.getElementById(`node-${nodeId}`);
    if (!nodeElement) return;

    const parentNodeHeader = nodeElement.parentElement?.querySelector('.node-header');
    if (!parentNodeHeader) return;

    const toggleSpan = parentNodeHeader.querySelector('.toggle');
    if (!toggleSpan) return;

    toggleSpan.textContent = isOpen ? '▼' : '▶';
  }

  toNumber(id: string): number {
    return Number(id);
  }

  confirmExamgroupDelete(examgroup: ExamGroup) {
    this.selected_examgroup = examgroup;
    this.showConfirmExamgroupDialog = true;
  }

  deleteExamgroupConfirmed() {
    if (this.selected_examgroup) {
      this.ExamgroupDelete(this.selected_examgroup.examgroup_id);
    }
    this.showConfirmExamgroupDialog = false;
    this.selected_examgroup = null;
  }

  cancelExamgroupDelete() {
    this.showConfirmExamgroupDialog = false;
    this.selected_examgroup = null;
  }

  confirmCategoryDelete(category: Category) {
    this.selected_category = category;
    this.showConfirmCategoryDialog = true;
  }

  deleteCategoryConfirmed() {
    if (this.selected_category) {
      this.CategoryDelete(this.selected_category.category_id);
    }
    this.showConfirmCategoryDialog = false;
    this.selected_category = null;
  }

  cancelCategoryDelete() {
    this.showConfirmCategoryDialog = false;
    this.selected_category = null;
  }

  ExamgroupDelete(examgroup_id: String) {
    this.errorMessage = '';
    this.resultMessage = '';
    const body = {
      examgroup_id: examgroup_id,
    };
    this.http.post(this.back_adress + 'manage/delete_examgroup', body).subscribe({
      next: (res) => {
        this.resultMessage = '試験科目を削除しました。';
        this.getGernres();
      },
      error: (err) => (this.errorMessage = err.error.error),
    });
  }

  CategoryDelete(category_id: String) {
    this.errorMessage = '';
    this.resultMessage = '';
    const body = {
      category_id: category_id,
    };
    this.http.post(this.back_adress + 'manage/delete_category', body).subscribe({
      next: (res) => {
        this.resultMessage = 'カテゴリーを削除しました。';
        this.getGernres();
      },
      error: (err) => (this.errorMessage = err.error.error),
    });
  }

  EditExamgroup(examgroup: ExamGroup) {
    this.router.navigate(['/manage/gernre/create'], {
      state: { examgroup: examgroup, edit: 'examgroup' },
    });
  }
  EditCategory(examgroup: ExamGroup, category_id: String) {
    examgroup.categorys = examgroup.categorys
      ? examgroup.categorys.filter((item) => category_id == item.category_id)
      : null;
    console.log(examgroup);
    if (examgroup.categorys != null) {
      this.router.navigate(['/manage/gernre/create'], {
        state: { examgroup: examgroup, edit: 'category' },
      });
    }
  }
}
