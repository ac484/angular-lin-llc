import {AfterViewInit, Component, Inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DOCUMENT} from '@angular/common';

import {ToolbarModule} from 'primeng/toolbar';
import {ButtonModule} from 'primeng/button';
import {ToggleButtonModule} from 'primeng/togglebutton';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ButtonModule, FormsModule, ToggleButtonModule, ToolbarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
  _darkTheme = false;

  constructor(@Inject(DOCUMENT) private document: Document) {
  }

  ngAfterViewInit(): void {
    // initial theme to match system theme
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      this.darkTheme = false;
    } else {
      this.darkTheme = true;
    }
  }

  get darkTheme(): boolean {
    return this._darkTheme;
  }

  set darkTheme(value: boolean) {
    this._darkTheme = value;
    if (this._darkTheme) {
      this.document.querySelector('html')?.classList.add('dark-theme');
    } else {
      this.document.querySelector('html')?.classList.remove('dark-theme');
    }
  }
}
