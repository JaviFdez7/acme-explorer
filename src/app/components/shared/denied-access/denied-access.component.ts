import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-denied-access',
  imports: [Button],
  templateUrl: './denied-access.component.html',
  styleUrl: './denied-access.component.css'
})
export class DeniedAccessComponent implements OnInit {
  protected url!: string;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.url = this.route.snapshot.queryParams['previousURL'] || '/';
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
