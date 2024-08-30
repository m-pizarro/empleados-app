import { CommonModule } from '@angular/common'
import { Component, computed } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatMenuModule } from '@angular/material/menu'
import { MatToolbarModule } from '@angular/material/toolbar'
import { Router } from '@angular/router'
import { AuthService } from '@app/core/services/auth.service'

@Component({
  selector: 'app-navbar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
})
export class NavbarComponent {
  userName = computed(() => this.authService.currentUserName())

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  logout(): void {
    this.authService.logout()
    this.router.navigate([''])
  }
}
