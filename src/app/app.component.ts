import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/shared/navbar/navbar.component';
import { PrimeNG } from 'primeng/config';
import { ThemeService } from './services/theme.service';
import { FooterComponent } from './components/shared/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, Navbar, FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'acme-explorer';

  constructor(private primeng: PrimeNG, private themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.initializeTheme(); // Initialize theme based on cached color
    this.themeService.initializeDarkMode(); // Initialize dark mode state
  } 
}
