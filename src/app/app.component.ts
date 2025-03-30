import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/shared/navbar/navbar.component';
import { PrimeNG } from 'primeng/config';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, Navbar
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'acme-explorer';

  constructor(private primeng: PrimeNG, private themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.setPreset('indigo');
  } 
}
