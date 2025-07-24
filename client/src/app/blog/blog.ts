import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Post } from '../shared/interfaces/post.interface';
import { PostsService } from '../shared/services/posts.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-blog',
    templateUrl: './blog.html',
    styleUrl: './blog.scss',
    standalone: false
})
export class Blog {
    showEditor: boolean = false;
    posts!: Post[];

    newBlog: Post = {
        title: '',
        content: '',
        author: ''
    };

    contentEditorValue: string = '';

    constructor(private postService: PostsService, private messageService: MessageService) {
        this.setupComponents();
    }

    setupComponents() {
        this.getPosts();
    }

    getPosts() {
        this.postService.getPosts().subscribe(response => (this.posts = response));
    }

    onSubmit() {
        const formData: FormData = new FormData();

        formData.append('title', this.newBlog.title);
        formData.append('author', this.newBlog.author);
        formData.append('content', this.newBlog.content);

        console.log('onSubmit! ', this.newBlog, formData);

        this.postService.createPost(formData).subscribe(
            response => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Post criado!',
                    detail: 'Post registrado com sucesso!',
                    life: 3000
                });

                console.log('API response: ', response);

                this.getPosts();
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
}
