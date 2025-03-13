import { Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-img-carousel',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './img-carousel.component.html',
  styleUrls: ['./img-carousel.component.css'],
})
export class ImageCarouselComponent{
  @Input() images: string[] = [];

  currentIndex: number = 0;
  timeoutId?: number;

  goToPrevious(): void {
    const isFirstSlide = this.currentIndex === 0;
    const newIndex = isFirstSlide
      ? this.images.length - 1
      : this.currentIndex - 1;

    this.currentIndex = newIndex;
  }

  goToNext(): void {
    const isLastSlide = this.currentIndex === this.images.length - 1;
    const newIndex = isLastSlide ? 0 : this.currentIndex + 1;

    this.currentIndex = newIndex;
  }

  goToSlide(slideIndex: number): void {
    this.currentIndex = slideIndex;
  }

  getCurrentSlideUrl(): string {
    return `url('${this.images[this.currentIndex]}')`;
  }

}