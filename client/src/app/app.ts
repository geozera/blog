import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { EditorModule } from 'primeng/editor';
import { InputTextModule } from 'primeng/inputtext';
import { Router, RouterModule } from '@angular/router';
import { AppModule } from './app-module';

@Component({
    selector: 'app-root',
    templateUrl: './app.html',
    standalone: true,
    imports: [ButtonModule, CommonModule, CardModule, MenubarModule, EditorModule, FormsModule, InputTextModule, RouterModule, AppModule]
})
export class App implements OnInit {
    menuBarItems: MenuItem[] = [];

    constructor(private router: Router) {}

    ngOnInit() {
        this.setupComponents();
    }

    setupComponents() {
        this.setupMenuBar();
    }

    setupMenuBar() {
        this.menuBarItems.push(
            {
                label: 'Início',
                icon: 'pi pi-home',
                routerLink: 'home'
            },
            {
                label: 'Blog',
                icon: 'pi pi-book',
                routerLink: 'blog'
            },
            {
                label: 'Sobre Mim',
                icon: 'pi pi-user',
                routerLink: 'about'
            },
            {
                label: 'Contato',
                icon: 'pi pi-envelope',
                routerLink: 'contact'
            }
        );
    }

    navigate(page: string) {
        this.router.navigate([page]);
    }
}
