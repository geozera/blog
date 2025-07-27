import { Routes } from '@angular/router';
import { About } from './about/about';
import { App } from './app';
import { Home } from './home/home';
import { Blog } from './blog/blog';
import { Contact } from './contact/contact';
import { Admin } from './admin/admin';

export const routes: Routes = [
    { path: 'home', component: Home},
    { path: 'blogs', component: Blog},
    { path: 'contact', component: Contact},
    { path: 'about', component: About},
    { path: 'admin', component: Admin},
    { path: '', redirectTo:'home',pathMatch:'full'},
];
