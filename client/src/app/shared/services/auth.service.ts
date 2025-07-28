import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILogin } from '../interfaces/login.interface';
import { firstValueFrom } from 'rxjs';
import { ILoginResponse } from '../interfaces/login-response.interface';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly _url: string = 'http://localhost:5177';

    constructor(private http: HttpClient) {}

    async authenticate(credentials: ILogin) {
        const url = `${this._url}/login`;
        const token = (await firstValueFrom(this.http.post<ILoginResponse>(url, credentials))).token;
        this.setAuthToken(token);
    }

    refresh() {
        const url = `${this._url}/refresh`;
        return this.http.post<ILoginResponse>(url, null);
    }

    setAuthToken(token: string): boolean {
        localStorage.setItem('token', token);
        return true;
    }

    getAuthToken(): string | null {
        return localStorage.getItem('token');
    }

    resetAuthToken() {
        localStorage.removeItem('token');
        return true;
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
    }
}
