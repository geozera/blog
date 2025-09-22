import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PostsService } from '../shared/services/posts.service';
import { IPost } from '../shared/interfaces/post.interface';

@Component({
    selector: 'app-last-post',
    templateUrl: './last-post.html',
    styleUrl: './last-post.scss',
    standalone: false
})
export class LastPost implements OnInit {
    spotlightPost: IPost | undefined;

    constructor(private postService: PostsService, private cd: ChangeDetectorRef) {}

    ngOnInit() {
        this.postService.getPosts().subscribe(response => {
            this.spotlightPost = response[response.length - 1];
            this.cd.detectChanges();
        });
    }
}
