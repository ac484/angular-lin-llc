import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './shared/nav-bar.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, NavBarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  navigationReady = false;
  currentUrl = '';

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentUrl = event.urlAfterRedirects;
      this.navigationReady = true;
    });
  }

  get isHideNavBarRoute(): boolean {
    if (!this.navigationReady) return true;
    return this.currentUrl.startsWith('/admin') || this.currentUrl.startsWith('/workspace');
  }
}
