import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Post } from '../shared/interfaces/post.interface';
import { PostsService } from '../shared/services/posts.service';

@Component({
    selector: 'app-blog',
    templateUrl: './blog.html',
    styleUrl: './blog.scss',
    standalone: false
})
export class Blog {
    posts: Post[] = [];
    latestPost!: Post;

    newBlog: Post = {
        title: '',
        content: '',
        author: ''
    };

    contentEditorValue: string = '';

constructor(private sanitizer: DomSanitizer, private postService: PostsService) {}

    ngOnInit() {
        this.setupComponents();

        this.getPosts();
    }

    setupComponents() {
    }

    getPosts() {
        this.postService.getPosts().subscribe(response => {
            this.posts = response;
            this.latestPost = this.posts[0];
        });
    }

        onSubmit() {
        const formData: FormData = new FormData();

        formData.append('title', this.newBlog.title);
        formData.append('author', this.newBlog.author);
        formData.append('content', this.newBlog.content);

        console.log('onSubmit! ', this.newBlog, formData);

        this.postService.createPost(formData).subscribe(response => console.log('API response: ', response));
    }
}
