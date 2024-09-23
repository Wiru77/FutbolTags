import { Component, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-field',
  standalone: true,
  templateUrl: './field.component.html',
  styleUrl: './field.component.css'
})
export class FieldComponent {
  // Tamaño del div en píxeles
  fieldWidthPixels = 1000; // píxeles
  fieldHeightPixels = 550; // píxeles

  // Para controlar el tooltip
  tooltipVisible = false;
  tooltipX = 0;
  tooltipY = 0;
  tooltipContent = '';

  // Coordenadas de inicio y fin del arrastre
  dragStartX: number = 0;
  dragStartY: number = 0;
  dragEndX: number = 0;
  dragEndY: number = 0;
  isDragging = false;

  // Output para emitir las coordenadas de clic y arrastre
  @Output() clickCoordinates = new EventEmitter<{ startX: number, startY: number, endX?: number, endY?: number }>();

  // Obtener referencia al div, tooltip, y canvas
  @ViewChild('field', { static: true }) fieldElement!: ElementRef;
  @ViewChild('tooltip', { static: true }) tooltipElement!: ElementRef;
  @ViewChild('arrowCanvas', { static: true }) arrowCanvas!: ElementRef;

  ngAfterViewInit() {
    const canvas = this.arrowCanvas.nativeElement;
    canvas.width = this.fieldWidthPixels;
    canvas.height = this.fieldHeightPixels;
  }

  onMouseMove(event: MouseEvent) {
    const rect = this.fieldElement.nativeElement.getBoundingClientRect();

    const mouseX = event.clientX - rect.left + window.scrollX;
    const mouseY = event.clientY - rect.top + window.scrollY;

    // Convertir coordenadas a rango 0-100 sin decimales
    const positionX = Math.floor((mouseX / this.fieldWidthPixels) * 100);
    const positionY = Math.floor((1 - (mouseY / this.fieldHeightPixels)) * 100);  // Invertir eje Y para que la esquina inferior izquierda sea (0, 0)

    this.tooltipContent = `X: ${positionX} Y: ${positionY}`;

    this.tooltipX = mouseX + 10;
    this.tooltipY = mouseY + 10;

    this.tooltipVisible = true;

    if (this.isDragging) {
      this.dragEndX = mouseX;
      this.dragEndY = mouseY;
      this.drawArrow();
    }
  }

  onMouseDown(event: MouseEvent) {
    const rect = this.fieldElement.nativeElement.getBoundingClientRect();

    this.dragStartX = event.clientX - rect.left + window.scrollX;
    this.dragStartY = event.clientY - rect.top + window.scrollY;

    this.dragEndX = this.dragStartX;
    this.dragEndY = this.dragStartY;
    this.isDragging = true;

    // Emitir las coordenadas del clic inicial
    
  }

  onMouseUp(event: MouseEvent) {
    this.isDragging = false;

    const distance = Math.sqrt(
      Math.pow(this.dragEndX - this.dragStartX, 2) + Math.pow(this.dragEndY - this.dragStartY, 2)
    );

    if (distance > 5) {
      this.drawArrow();
      // Emitir las coordenadas del arrastre (inicio y fin)
      this.emitCoordinates(this.dragStartX, this.dragStartY, this.dragEndX, this.dragEndY);
    } else {
      this.clearCanvas();
      this.emitCoordinates(this.dragStartX, this.dragStartY);
    }
  }

  emitCoordinates(startX: number, startY: number, endX?: number, endY?: number) {
    // Normalizar las coordenadas a rango 0-100
    const normalizedStartX = Math.floor((startX / this.fieldWidthPixels) * 100);
    const normalizedStartY = Math.floor((1 - (startY / this.fieldHeightPixels)) * 100);
    let normalizedEndX, normalizedEndY;

    if (endX !== undefined && endY !== undefined) {
      normalizedEndX = Math.floor((endX / this.fieldWidthPixels) * 100);
      normalizedEndY = Math.floor((1 - (endY / this.fieldHeightPixels)) * 100);
    }

    // Emitir evento con las coordenadas normalizadas
    this.clickCoordinates.emit({
      startX: normalizedStartX,
      startY: normalizedStartY,
      endX: normalizedEndX,
      endY: normalizedEndY
    });
  }

  clearCanvas() {
    const canvas = this.arrowCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  hideTooltip() {
    this.tooltipVisible = false;
  }

  drawArrow() {
    const canvas = this.arrowCanvas.nativeElement;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      ctx.moveTo(this.dragStartX, this.dragStartY);
      ctx.lineTo(this.dragEndX, this.dragEndY);
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.stroke();

      const arrowHeadLength = 10;
      const angle = Math.atan2(this.dragEndY - this.dragStartY, this.dragEndX - this.dragStartX);

      ctx.beginPath();
      ctx.moveTo(this.dragEndX, this.dragEndY);
      ctx.lineTo(this.dragEndX - arrowHeadLength * Math.cos(angle - Math.PI / 6),
                 this.dragEndY - arrowHeadLength * Math.sin(angle - Math.PI / 6));
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(this.dragEndX, this.dragEndY);
      ctx.lineTo(this.dragEndX - arrowHeadLength * Math.cos(angle + Math.PI / 6),
                 this.dragEndY - arrowHeadLength * Math.sin(angle + Math.PI / 6));
      ctx.stroke();
    }
  }
}
