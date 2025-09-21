import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IPost } from '../shared/interfaces/post.interface';
import { PostsService } from '../shared/services/posts.service';
import { MessageService } from 'primeng/api';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-blog',
    templateUrl: './blog.html',
    styleUrl: './blog.scss',
    standalone: false
})
export class Blog implements OnInit {
    posts!: IPost[];

    contentEditorValue: string = '';
    isAuthenticated: boolean = false;

    constructor(private postService: PostsService, authService: AuthService, private router: Router, private cd: ChangeDetectorRef) {
        this.isAuthenticated = authService.isAuthenticated();
    }

    ngOnInit() {
        this.getPosts();
    }

    getPosts() {
        this.postService.getPosts().subscribe(response => {
            this.posts = [...response];
            this.cd.detectChanges();
        });
    }

    navigate(route: string[]) {
        this.router.navigate(route);
    }
}
