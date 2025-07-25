import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../interfaces/post.interface';

@Injectable({
    providedIn: 'root'
})
export class PostsService {
    private readonly _url: string = 'http://localhost:5177/blogs';

    constructor(private http: HttpClient) {}

    getPosts(options?: any): Observable<Post[]> {
        return this.http.get<Post[]>(this._url);
    }

    createPost(post: FormData): Observable<Post> {
        return this.http.post<Post>(this._url, post);
    }
}
