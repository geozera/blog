import { Component } from '@angular/core';
import { PostsService } from '../shared/services/posts.service';
import { IPost } from '../shared/interfaces/post.interface';
import { MessageService } from 'primeng/api';
import { AuthService } from '../shared/services/auth.service';
import { ILogin } from '../shared/interfaces/login.interface';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.html',
    styleUrl: './admin.scss',
    standalone: false
})
export class Admin {
    credentials: ILogin = {
        username: '',
        password: ''
    };

    newBlog: IPost = {
        title: '',
        content: '',
        author: 'Geovany Bezerra'
    };

    isAuthenticated: () => boolean;

    showEditor: boolean = false;

    constructor(private postService: PostsService, private messageService: MessageService, private authService: AuthService) {
        this.isAuthenticated = authService.isAuthenticated.bind(this);
    }

    resetEditor() {
        this.newBlog = {
            author: '',
            content: '',
            title: ''
        };
    }

    onSubmitAuthenticate() {

        this.authService
            .authenticate(this.credentials)
            .then(() => {
                this.isAuthenticated = this.authService.isAuthenticated.bind(this);
                this.messageService.add({
                    severity: 'info',
                    summary: this.authService.isAuthenticated() ? 'Conectado!' : 'Erro na autenticação!',
                    life: 3000
                });
            })
            .catch(err => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Erro na autenticação!',
                    detail: err,
                    life: 3000
                });
            });
    }

    onSubmitNewPost() {
        const formData: FormData = new FormData();

        formData.append('title', this.newBlog.title);
        formData.append('author', this.newBlog.author);
        formData.append('content', this.newBlog.content);

        this.postService.createPost(formData).subscribe(
            response => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Post criado!',
                    detail: `Post  "${response.title}" registrado com sucesso!`,
                    life: 3000
                });
            },
            error => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Erro ao criar post!',
                    life: 3000
                });
            }
        );
    }

    saveAccessToken(token: string) {
        this.authService.setAuthToken(token);
    }

    resetAccessToken() {
        this.authService.resetAuthToken();

        if (!this.authService.isAuthenticated())
            this.messageService.add({
                severity: 'warn',
                summary: 'Desconectado!',
                life: 3000
            });
    }
}
