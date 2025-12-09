import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-incorrect',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './incorrect.component.html',
  styleUrls: ['./incorrect.component.css'],
})
export class InCorrectComponent {
  visible = true;

  ngOnInit(): void {
    setTimeout(() => {
      this.visible = false;
    }, 1500);
  }
}
