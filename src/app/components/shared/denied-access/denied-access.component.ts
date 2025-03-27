import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-denied-access',
  imports: [],
  templateUrl: './denied-access.component.html',
  styleUrl: './denied-access.component.css'
})
export class DeniedAccessComponent implements OnInit {
  protected url!: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.url = this.route.snapshot.queryParams['previousURL'] || '/';
  }
}
