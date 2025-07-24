import { Routes } from '@angular/router';
import { About } from './about/about';
import { App } from './app';
import { Home } from './home/home';
import { Blog } from './blog/blog';
import { Contact } from './contact/contact';

export const routes: Routes = [
    { path: 'home', component: Home},
    { path: 'blog', component: Blog},
    { path: 'contact', component: Contact},
    { path: 'about', component: About},
    { path: '', redirectTo:'home',pathMatch:'full'},
];
