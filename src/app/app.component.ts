import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TripDisplayComponent } from "./components/trip/trip-display/trip-display.component";
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TripDisplayComponent, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'acme-explorer';
}
