import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILogin } from '../interfaces/login.interface';
import { firstValueFrom, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly _url: string = 'http://localhost:5177/login';

    constructor(private http: HttpClient) {}

    async authenticate(credentials: ILogin) {
        const token = (await firstValueFrom(this.http.post<{ token: string }>(this._url, credentials))).token;
        this.setAuthToken(token);
    }

    setAuthToken(token: string) {
        localStorage.setItem('token', token);
    }

    resetAuthToken() {
        localStorage.removeItem('token');
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
    }
}
