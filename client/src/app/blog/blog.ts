import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IPost } from '../shared/interfaces/post.interface';
import { PostsService } from '../shared/services/posts.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-blog',
    templateUrl: './blog.html',
    styleUrl: './blog.scss',
    standalone: false
})
export class Blog {
    posts!: IPost[];

    contentEditorValue: string = '';

    constructor(private postService: PostsService, ) {
        this.setupComponents();
    }

    setupComponents() {
        this.getPosts();
    }

    getPosts() {
        this.postService.getPosts().subscribe(response => (this.posts = response));
    }

   
}
