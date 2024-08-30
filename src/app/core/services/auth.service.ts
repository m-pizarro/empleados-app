import { HttpClient } from '@angular/common/http'
import { inject, Injectable, signal } from '@angular/core'
import { Observable } from 'rxjs'
import { Login, LoginResponse } from '../interfaces/login.interface'
import { Usuario } from '../interfaces/usuario.interface.ts'
import { AuthStoreService } from './auth.store.service'
import { tap } from 'rxjs/operators'
import { environment } from '@env/environment.development'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authStoreService = inject(AuthStoreService)
  private http = inject(HttpClient)
  private baseUrl: string = environment.apiUrl
  currentUserName = signal<string>('')

  constructor() {
    const storedUser = this.authStoreService.getUserName()
    if (storedUser) {
      this.currentUserName.set(storedUser)
    }
  }

  registrarse(objeto: Usuario): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/auth/register`, objeto)
  }

  login(login: Login): Observable<LoginResponse> {
    this.currentUserName.set(login.email)
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/Login`, login)
  }

  logout() {
    this.http
      .post<LoginResponse>(`${this.baseUrl}/auth/logout`, {
        sub: this.authStoreService.getUserName(),
      })
      .subscribe({
        next: () => {
          this.currentUserName.set('')
          this.authStoreService.removeAll()
        },
      })
  }

  refreshTokens(): Observable<{ access_token: string; refresh_token: string }> {
    return this.http
      .post<{ access_token: string; refresh_token: string }>(
        `${this.baseUrl}/auth/refresh`,
        {
          sub: this.authStoreService.getUserName(),
          refreshToken: this.authStoreService.getRefreshToken(),
        },
      )
      .pipe(
        tap((tokens: { access_token: string; refresh_token: string }) => {
          this.authStoreService.setAccessToken(tokens.access_token)
          this.authStoreService.setRefreshToken(tokens.refresh_token)
        }),
      )
  }
}
