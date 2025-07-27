import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPost } from '../interfaces/post.interface';

@Injectable({
    providedIn: 'root'
})
export class PostsService {
    private readonly _url: string = 'http://localhost:5177/blogs';

    constructor(private http: HttpClient) {}

    getPosts(options?: any): Observable<IPost[]> {
        return this.http.get<IPost[]>(this._url);
    }

    createPost(post: FormData): Observable<IPost> {
        return this.http.post<IPost>(this._url, post);
    }
}
