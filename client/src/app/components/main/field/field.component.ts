import {
  Component,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter,
  AfterViewInit,
  HostListener,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { JugadorService } from '../../../services/jugador.service';
import { AdminService } from '../../../services/admin.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

declare var jQuery: any;
declare var $: any;
declare var iziToast: any;

@Component({
  selector: 'app-field',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css'],
})
export class FieldComponent implements OnInit, AfterViewInit {
  public selectedJugadorId: any;
  public selectedEquipoId: any;
  public receptorId: any;
  public token: any;
  public invertirX: boolean = false;
  public angulo1: number = 0;
  public angulo2: number = 0;
  public angulo3: number = 0;
  public angulo4: number = 0;
  public backgroundImage = '../../../../assets/img/cancha1.jpg';
  public isPorteria = false;
  public coordenadasCancha: any;
  public normalizedCoordenadasCancha: any;

  fieldWidthPixels!: number;
  fieldHeightPixels!: number;
  tooltipVisible = false;
  tooltipX = 0;
  tooltipY = 0;
  tooltipContent = '';
  dragStartX: number = 0;
  dragStartY: number = 0;
  dragEndX: number = 0;
  dragEndY: number = 0;
  isDragging = false;

  @Output() clickCoordinates = new EventEmitter<{
    startX: number;
    startY: number;
    endX?: number;
    endY?: number;
    porteriaX?: number;
    porteriaY?: number;
  }>();
  @Output() onDeleteLast: EventEmitter<any> = new EventEmitter();
  @Output() direccionDetectada = new EventEmitter<string>();
  @Input() dataList: any = [1];
  @Input() currentTag: any;
  @Input() equipoId!: string;
  @Input() selectedPlayer2!: any;

  @ViewChild('field', { static: true }) fieldElement!: ElementRef;
  @ViewChild('tooltip', { static: true }) tooltipElement!: ElementRef;
  @ViewChild('arrowCanvas', { static: true }) arrowCanvas!: ElementRef;
  @ViewChild('flecha1') flecha1Element: ElementRef | undefined;
  @ViewChild('flecha2') flecha2Element: ElementRef | undefined;

  constructor(
    private _jugadorService: JugadorService,
    private _adminService: AdminService
  ) {
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
    const invertirXStorage = localStorage.getItem('invertirX');
    this.invertirX = invertirXStorage ? JSON.parse(invertirXStorage) : false;
    this.cargarAngulosDesdeStorage();
  }

  ngAfterViewInit() {
    this.updateFieldSize();
    const canvas = this.arrowCanvas.nativeElement;
    canvas.width = this.fieldWidthPixels;
    canvas.height = this.fieldHeightPixels;
    this.actualizarFlechas();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateFieldSize();
    const canvas = this.arrowCanvas.nativeElement;
    canvas.width = this.fieldWidthPixels;
    canvas.height = this.fieldHeightPixels;
  }

  updateBackgroundImage() {
    const esPorteria = this.currentTag?.porteria === true;
    const nuevaImagen = esPorteria
      ? '../../../../assets/img/porteria.jpg'
      : '../../../../assets/img/cancha1.jpg';
    const nuevoIsPorteria = esPorteria;

    setTimeout(() => {
      this.backgroundImage = nuevaImagen;
      this.isPorteria = nuevoIsPorteria;
      if (this.fieldElement && this.fieldElement.nativeElement) {
        this.fieldElement.nativeElement.style.backgroundImage = `url('${this.backgroundImage}')`;
      }
    }, 10); // 10 milisegundos
  }

  cambiarAImagenCancha() {
    const nuevaImagen = '../../../../assets/img/cancha1.jpg';

    setTimeout(() => {
      if (this.fieldElement && this.fieldElement.nativeElement) {
        this.fieldElement.nativeElement.style.backgroundImage = `url('${nuevaImagen}')`;
      }
    }, 10); // 10 milisegundos

    this.isPorteria = false;
  }

  cambiarAImagenPorteria() {
    const nuevaImagen = '../../../../assets/img/porteria.jpg';

    setTimeout(() => {
      if (this.fieldElement && this.fieldElement.nativeElement) {
        this.fieldElement.nativeElement.style.backgroundImage = `url('${nuevaImagen}')`;
      }
    }, 10); // 10 milisegundos

    this.isPorteria = true;
    this.clearArrowCanvas();
  }

  cambiarConBotonACancha(tag: string) {
    this.currentTag = tag;
  }

  updateFieldSize() {
    const rect = this.fieldElement.nativeElement.getBoundingClientRect();
    this.fieldWidthPixels = rect.width;
    this.fieldHeightPixels = rect.height;
  }

  onMouseMove(event: MouseEvent) {
    this.handleMove(event.clientX, event.clientY, event.button);
  }

  onMouseDown(event: MouseEvent) {
    this.handleDown(event.clientX, event.clientY, event.button);
  }

  onMouseUp(event: MouseEvent) {
    if (event.button !== 0) return;
    this.handleUp(event.button);
  }

  onTouchMove(event: TouchEvent) {
    const touch = event.touches[0];
    this.handleMove(touch.clientX, touch.clientY, 0);
  }

  onTouchStart(event: TouchEvent) {
    const touch = event.touches[0];
    this.handleDown(touch.clientX, touch.clientY, 0);
  }

  onTouchEnd(event: TouchEvent) {
    this.handleUp(0);
  }

  handleMove(clientX: number, clientY: number, button: number) {
    if (button === 0) {
      const rect = this.fieldElement.nativeElement.getBoundingClientRect();
      let mouseX = clientX - rect.left + window.scrollX;
      let mouseY = clientY - rect.top + window.scrollY;
      let positionX = Math.floor((mouseX / this.fieldWidthPixels) * 100);
      let positionY = Math.floor((1 - mouseY / this.fieldHeightPixels) * 100);
      if (this.invertirX) {
        positionX = 100 - positionX;
      }
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
  }

  handleDown(clientX: number, clientY: number, button: number) {
    if (button === 0) {
      const rect = this.fieldElement.nativeElement.getBoundingClientRect();
      this.dragStartX = clientX - rect.left + window.scrollX;
      this.dragStartY = clientY - rect.top + window.scrollY;
      this.dragEndX = this.dragStartX;
      this.dragEndY = this.dragStartY;
      this.isDragging = true;
    }
  }

  handleUp(button: number) {
    if (button === 0) {
      this.isDragging = false;

      const distance = Math.sqrt(
        Math.pow(this.dragEndX - this.dragStartX, 2) +
          Math.pow(this.dragEndY - this.dragStartY, 2)
      );

      if (this.currentTag?.porteria === true) {
        if (this.isPorteria) {
          const coordenadasPorteria = {
            startX: this.dragStartX,
            startY: this.dragStartY,
          };
          this.emitCoordinates(
            this.coordenadasCancha.startX,
            this.coordenadasCancha.startY,
            this.coordenadasCancha.endX,
            this.coordenadasCancha.endY,
            coordenadasPorteria.startX,
            coordenadasPorteria.startY
          );
          let normalizedAngle = this.calcularAngulo();
          this.detectarDireccion(normalizedAngle);
          this.cambiarAImagenCancha();
        } else {
          this.clearArrowCanvas();

          this.coordenadasCancha = {
            startX: this.dragStartX,
            startY: this.dragStartY,
            endX: this.dragEndX,
            endY: this.dragEndY,
          };
          this.cambiarAImagenPorteria();
        }
      } else {
        this.emitCoordinates(
          this.dragStartX,
          this.dragStartY,
          this.dragEndX,
          this.dragEndY
        );
        if (distance === 0) {
          this.detectarDireccion(0);
        } else {
          let normalizedAngle = this.calcularAngulo();
          this.detectarDireccion(normalizedAngle);
        }
      }
    }
  }

  calcularAngulo() {
    const angle =
      Math.atan2(
        this.dragEndY - this.dragStartY,
        this.dragEndX - this.dragStartX
      ) *
      (180 / Math.PI);
    const normalizedAngle = (angle + 360) % 360;

    return normalizedAngle;
  }

  deleteLast(event: MouseEvent) {
    if (event.button === 2) {
      event.preventDefault();
      this.clearCanvas();
      this.onDeleteLast.emit();
      const eventosStorage = JSON.parse(
        localStorage.getItem('eventosData') || '{}'
      );
      if (eventosStorage.dataList && eventosStorage.dataList.length > 0) {
        eventosStorage.dataList.pop();
        localStorage.setItem('eventosData', JSON.stringify(eventosStorage));
      }
      this.dataList.pop();
    }
  }

  emitCoordinates(
    startX: number,
    startY: number,
    endX?: number,
    endY?: number,
    porteriaX?: number,
    porteriaY?: number
  ) {
    let normalizedStartX = Math.floor((startX / this.fieldWidthPixels) * 100);
    let normalizedStartY = Math.floor(
      (1 - startY / this.fieldHeightPixels) * 100
    );
    if (this.invertirX) {
      normalizedStartX = 100 - normalizedStartX;
    }
    let normalizedEndX: number | undefined;
    let normalizedEndY: number | undefined;
    if (endX !== undefined && endY !== undefined) {
      normalizedEndX = Math.floor((endX / this.fieldWidthPixels) * 100);
      normalizedEndY = Math.floor((1 - endY / this.fieldHeightPixels) * 100);
      if (this.invertirX) {
        normalizedEndX = 100 - normalizedEndX;
      }
      if (
        normalizedStartX === normalizedEndX &&
        normalizedStartY === normalizedEndY
      ) {
        normalizedEndX = undefined;
        normalizedEndY = undefined;
      }
    }
    let normalizedPorteriaX: number | undefined;
    let normalizedPorteriaY: number | undefined;
    if (porteriaX !== undefined && porteriaY !== undefined) {
      normalizedPorteriaX = Math.floor(
        (porteriaX / this.fieldWidthPixels) * 100
      );
      normalizedPorteriaY = Math.floor(
        (1 - porteriaY / this.fieldHeightPixels) * 100
      );
      if (this.invertirX) {
        normalizedPorteriaX = 100 - normalizedPorteriaX;
      }
    }
    this.clickCoordinates.emit({
      startX: normalizedStartX,
      startY: normalizedStartY,
      endX: normalizedEndX,
      endY: normalizedEndY,
      porteriaX: normalizedPorteriaX,
      porteriaY: normalizedPorteriaY,
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

    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (this.isPorteria) {
      return; // No dibujar la flecha si está en modo portería
    }

    ctx.beginPath();
    ctx.moveTo(this.dragStartX, this.dragStartY);
    ctx.lineTo(this.dragEndX, this.dragEndY);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.stroke();

    const arrowHeadLength = 10;
    const angle = Math.atan2(
      this.dragEndY - this.dragStartY,
      this.dragEndX - this.dragStartX
    );

    ctx.beginPath();
    ctx.moveTo(this.dragEndX, this.dragEndY);
    ctx.lineTo(
      this.dragEndX - arrowHeadLength * Math.cos(angle - Math.PI / 6),
      this.dragEndY - arrowHeadLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(this.dragEndX, this.dragEndY);
    ctx.lineTo(
      this.dragEndX - arrowHeadLength * Math.cos(angle + Math.PI / 6),
      this.dragEndY - arrowHeadLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();
  }

  clearArrowCanvas() {
    const canvas = this.arrowCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  detectarDireccion(angulo: number) {
    if (angulo !== 0) {
      const angulos = JSON.parse(localStorage.getItem('angulosData') || 'null');
      const angulosStorage = angulos ? angulos : { angulo1: 45, angulo2: 315 };
      this.angulo1 = angulosStorage.angulo1;
      this.angulo2 = angulosStorage.angulo2;
      this.angulo3 = (angulosStorage.angulo1 + 180) % 360;
      this.angulo4 = (angulosStorage.angulo2 + 180) % 360;
      let direccion = '';
      if (this.invertirX) {
        angulo = (angulo + 180) % 360;
      }
      if (!this.invertirX) {
        angulo = angulo % 360;
      }
      if (
        (angulo >= 0 && angulo <= this.angulo1) ||
        (angulo >= this.angulo2 && angulo <= 360)
      ) {
        direccion = 'Frente';
      } else if (angulo >= this.angulo1 + 1 && angulo <= this.angulo4) {
        direccion = this.invertirX ? 'Derecha' : 'Derecha';
      } else if (angulo >= this.angulo4 + 1 && angulo <= this.angulo3) {
        direccion = 'Detrás';
      } else if (angulo >= this.angulo3 + 1 && angulo <= this.angulo2) {
        direccion = this.invertirX ? 'Izquierda' : 'Izquierda';
      }
      this.direccionDetectada.emit(direccion);
    } else {
      this.direccionDetectada.emit('');
    }
  }

  invertirEje() {
    this.invertirX = !this.invertirX;
    localStorage.setItem('invertirX', JSON.stringify(this.invertirX));
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
      this.flecha1Element.nativeElement.style.transform = `rotate(${this.angulo1}deg)`;
      this.flecha2Element.nativeElement.style.transform = `rotate(${this.angulo2}deg)`;
    }
  }

  submit(): void {
    localStorage.setItem(
      'angulosData',
      JSON.stringify({
        angulo1: this.angulo1,
        angulo2: this.angulo2,
      })
    );
    iziToast.show({
      title: 'SUCCESS',
      titleColor: '#1DC74C',
      color: '#FFF',
      class: 'text-success',
      position: 'topRight',
      message: 'Se guardaron correctamente los nuevos ángulos de dirección',
    });
  }

  cargarAngulosDesdeStorage(): void {
    const datos = localStorage.getItem('angulosData');
    if (datos) {
      const { angulo1, angulo2 } = JSON.parse(datos);
      this.angulo1 = angulo1;
      this.angulo2 = angulo2;
      this.actualizarFlechas(); // Aplica la rotación
    } else {
      this.angulo1 = 0;
      this.angulo2 = 0;
      this.actualizarFlechas();
    }
  }
}
