import { Injectable } from '@angular/core'

const ACCESS_TOKEN_KEY = 'app.empleados.access.token'
const REFRESH_TOKEN_KEY = 'app.empleados.refresh.token'
const USER_NAME = 'app.empleados.user.name'

@Injectable({
  providedIn: 'root',
})
export class AuthStoreService {
  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  }

  setAccessToken(token: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token)
  }

  removeAccessToken(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
  }

  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  }

  setRefreshToken(token: string) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token)
  }

  removeRefreshToken(): void {
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  }

  getUserName() {
    return localStorage.getItem(USER_NAME)
  }

  setUserName(userName: string) {
    localStorage.setItem(USER_NAME, userName)
  }

  removeUserName(): void {
    localStorage.removeItem(USER_NAME)
  }

  removeAll(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_NAME)
  }
}
