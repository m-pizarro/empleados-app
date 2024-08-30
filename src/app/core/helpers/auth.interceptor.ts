import { HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { catchError, switchMap, throwError } from 'rxjs'
import { AuthService } from '../services/auth.service'
import { AuthStoreService } from '../services/auth.store.service'
import { Router } from '@angular/router'

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.indexOf('auth') > 0 && req.url.indexOf('logout') <= 0)
    return next(req)

  const router = inject(Router)
  const authService = inject(AuthService)
  const authStoreService = inject(AuthStoreService)
  const accessToken = authStoreService.getAccessToken()

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return next(authReq).pipe(
    catchError((err) => {
      return authService.refreshTokens().pipe(
        switchMap((res) => {
          authStoreService.setAccessToken(res.access_token)
          const newReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${res.access_token}`,
            },
          })
          return next(newReq)
        }),
        catchError((e) => {
          if (e.status === 401 || e.status === 403) {
            authStoreService.removeAll()
            router.navigate([''])
          }
          return throwError(() => new Error(e))
        }),
      )
    }),
  )
}
