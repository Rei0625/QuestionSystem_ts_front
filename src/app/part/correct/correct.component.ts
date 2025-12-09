import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-correct',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './correct.component.html',
  styleUrls: ['./correct.component.css'],
})
export class CorrectComponent {
  visible = true;

  ngOnInit(): void {
    setTimeout(() => {
      this.visible = false;
    }, 1200);
  }
}
