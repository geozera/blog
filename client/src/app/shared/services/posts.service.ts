import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../interfaces/post.interface';

@Injectable({
    providedIn: 'root'
})
export class PostsService {
    constructor(private http: HttpClient) {}

    private URL: string = 'http://localhost:5177';

    private POSTS_URL: string = `${this.URL}/blogs`;

    getPosts(options?: any): Observable<Post[]> {
        return this.http.get<Post[]>(this.POSTS_URL);
    }

    createPost(post: FormData): Observable<Post> {
        return this.http.post<Post>(this.POSTS_URL, post);
    }
}
