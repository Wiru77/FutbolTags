import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { NavComponent } from '../../nav/nav.component';
import { AdminService } from '../../../services/admin.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-index-stats',
  standalone: true,
  imports: [NavComponent, FormsModule, CommonModule, RouterModule],
  templateUrl: './index-stats.component.html',
  styleUrl: './index-stats.component.css',
})
export class IndexStatsComponent implements OnInit, AfterViewInit {
  angulo1: number = 0;
  angulo2: number = 0;
  genial: any;

  @ViewChild('flecha1') flecha1Element: ElementRef | undefined;
  @ViewChild('flecha2') flecha2Element: ElementRef | undefined;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.actualizarFlechas();
  }

  moverArriba(): void {
    if (this.angulo1 === 90 && this.angulo2 === 270) {
    } else {
      this.angulo1 += 2.5;
      this.angulo2 -= 2.5;
      this.actualizarFlechas();
    }
  }

  moverAbajo(): void {
    if (this.angulo1 === 0 && this.angulo2 === 0) {
    } else {
      this.angulo1 -= 2.5;
      this.angulo2 += 2.5;
      this.actualizarFlechas();
    }
  }

  actualizarFlechas(): void {
    this.angulo1 = this.angulo1 % 360;
    this.angulo2 = this.angulo2 % 360;
    if (this.angulo1 < 0) {
      this.angulo1 = 360 + this.angulo1;
    }
    if (this.angulo2 < 0) {
      this.angulo2 = 360 + this.angulo2;
    }

    if (this.flecha1Element && this.flecha2Element) {
      this.flecha1Element.nativeElement.style.setProperty(
        'transform',
        `rotate(${this.angulo1}deg)`
      );
      this.flecha2Element.nativeElement.style.setProperty(
        'transform',
        `rotate(${this.angulo2}deg)`
      );
    }
  }

  submit(): void {
    console.log('Formulario enviado con ángulos:', this.angulo1, this.angulo2);
  }

  funcion1() {
    this.genial = 'La concha de la lora';
  }

  funcion2() {
    this.genial = 'Perros del mal';
    this.funcion1();
    console.log(this.genial);
  }
}
