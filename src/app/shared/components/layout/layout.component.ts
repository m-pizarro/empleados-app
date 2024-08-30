import { Component } from '@angular/core'
import { NavbarComponent } from '../nav-bar/nav-bar.component'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {}
