import { Component } from '@angular/core';
import { PostsService } from '../shared/services/posts.service';
import { Post } from '../shared/interfaces/post.interface';

@Component({
    selector: 'app-last-post',
    templateUrl: './last-post.html',
    styleUrl: './last-post.scss',
    standalone: false
})
export class LastPost {
    spotlightPost!: Post;

    constructor(private postService: PostsService) {
        this.postService.getPosts().subscribe(response => (this.spotlightPost = response[0]));
    }
}
