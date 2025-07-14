import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'app-root',
    template: `
        <div>
            <p-menubar [model]="menuBarItems">aegonvy.com - Blog do Geo</p-menubar>

            <ng-container *ngIf="currentPage === 'home'">
                <p-card>
                    <p>Bem-vindo ao meu blog!</p>
                    <p>Sou o Geovany Bezerra, atualmente Desenvolvedor de Software Fullstack. Conheça-me melhor na página "Sobre Mim".</p>
                    <p>Esse website é um blog onde publico minhas ideias e reflexões.</p></p-card
                >

                <p-card header="Último Post"> <div [innerHTML]="latestPost.content"></div></p-card>
            </ng-container>

            <ng-container *ngIf="currentPage === 'blog'">
                <div *ngFor="let post of posts">
                    <p-card [header]="post.title">
                        <div [innerHTML]="post.content"></div>
                    </p-card>
                </div>
            </ng-container>

            <ng-container *ngIf="currentPage === 'about'">
                <p-card header="Sobre Mim">
                    <h3 class="text-xl font-semibold mb-2">Biografia</h3>
                    <p class="mb-4">[TODO]</p>
                    <h3 class="text-xl font-semibold mb-2">Feitos</h3>
                    <p class="mb-4">[TODO]</p>
                    <h3 class="text-xl font-semibold mb-2">Ambições</h3>
                    <p>[TODO]</p>
                </p-card>
            </ng-container>

            <ng-container *ngIf="currentPage === 'contact'">
                <p-card header="Contato">
                    <p class="mb-4">Encontre-me em:</p>
                    <a
                        href="https://github.com/geozera"
                        target="_blank"
                        pButton
                        rel="noopener noreferrer"
                        ><span pButtonLabel>GitHub</span></a
                    >
                    <a
                        href="https://linkedin.com/in/geovanybezerra"
                        target="_blank"
                        pButton
                        rel="noopener noreferrer"
                        ><span pButtonLabel>Linkedin</span></a
                    >
                </p-card>
            </ng-container>
        </div>
    `,
    styles: [],
    imports: [ButtonModule, CommonModule, CardModule, MenubarModule]
})
export class App implements OnInit {
    currentPage: string = 'home';

    posts: { title: string; content: SafeHtml }[] = [];
    latestPost: { title: string; content: SafeHtml };

    menuBarItems: MenuItem[] = [];

    constructor(private sanitizer: DomSanitizer) {
        const markdownPosts = [
            {
                title: 'Primeiro Post',
                markdown: `#### Bem-vindo ao Blog\nEste é um **post de exemplo** escrito em _Markdown_.`
            },
            {
                title: 'Segundo Post',
                markdown: `## Outro Post\nVocê pode escrever seus textos em **Markdown** e eles serão renderizados corretamente.`
            }
        ];

        this.posts = markdownPosts.map(post => ({
            title: post.title,
            content: this.sanitizer.bypassSecurityTrustHtml(String(marked.parse(post.markdown)))
        }));

        this.latestPost = this.posts[0];
    }

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
                command: () => {
                    this.navigate('home');
                }
            },
            {
                label: 'Blog',
                icon: 'pi pi-book',
                command: () => {
                    this.navigate('blog');
                }
            },
            {
                label: 'Sobre Mim',
                icon: 'pi pi-user',
                command: () => {
                    this.navigate('about');
                }
            },
            {
                label: 'Contato',
                icon: 'pi pi-envelope',
                command: () => {
                    this.navigate('contact');
                }
            }
        );
    }

    navigate(page: string) {
        this.currentPage = page;
    }
}
