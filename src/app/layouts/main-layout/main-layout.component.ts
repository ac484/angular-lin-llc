import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { SidenavComponent } from './sidenav/sidenav.component';
import {NavSectionComponent} from './sidenav/nav-section/nav-section.component';
import {NavSection} from './sidenav/nav-section/menu-item.interface';
import {HamburgerMenuComponent} from './sidenav/hamburger/hamburger-menu.component';
import {LoadingIndicatorComponent} from './loading-indicator/loading-indicator.component';
import { WorkspaceSidenavComponent } from './workspace-sidenav/workspace-sidenav.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, SidebarModule, SidenavComponent, NavSectionComponent, HamburgerMenuComponent, LoadingIndicatorComponent, WorkspaceSidenavComponent],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  router = inject(Router);
  get isWorkspacePage(): boolean {
    return this.router.url.startsWith('/workspace');
  }

  headerSection: NavSection = {
    title:'Dashboard',
    icon: 'pi pi-home',
    routerLink:'/dashboard'
  };

  bodySection: NavSection[] = [
    {
      title: 'UI Elements',
      icon: 'pi pi-cog',
      items: [
        {
          label: 'Alerts',
          routerLink: '/alerts'
        },
        {
          label: 'Buttons',
          routerLink: '/buttons'
        }
      ]
    },
    {

      title: 'More Pages',
      icon: 'pi pi-list',
      items: [
        {
          label: 'Sub Pages',
          items: [
            { label: 'Sub Page', routerLink: '/workspace' },
            { label: 'Sub Page 2', routerLink: '/404' },
            { label: 'Sub Page 3', routerLink: '/404' }
          ]
        }
      ]
    }
  ];

  footerSection: NavSection = {
    icon: 'pi pi-user',
    items: [
      {
        label: 'Logout',
        routerLink: '/logout'
      }
    ]
  };
}
