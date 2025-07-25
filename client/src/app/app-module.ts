import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { EditorModule } from 'primeng/editor';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { Blog } from './blog/blog';
import { About } from './about/about';
import { Contact } from './contact/contact';
import { Home } from './home/home';
import { ToastModule } from 'primeng/toast';
import { Intro } from './intro/intro';
import { LastPost } from './last-post/last-post';
import { PostComponent } from './blog/post/post';

@NgModule({
    declarations: [Home, Blog, About, Contact, Intro, LastPost, PostComponent],
    imports: [CommonModule, ButtonModule, CommonModule, CardModule, MenubarModule, EditorModule, FormsModule, InputTextModule, ToastModule]
})
export class AppModule {}
