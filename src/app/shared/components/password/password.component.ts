import { Component } from '@angular/core';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [PasswordModule],
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent {}