import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { AuthStoreService } from '../services/auth.store.service'

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const authStoreService = inject(AuthStoreService)
  const token = authStoreService.getAccessToken()
  return token ? true : router.createUrlTree([''])
}
