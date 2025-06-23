import { Component, OnInit } from '@angular/core';
import { NavComponent } from '../../../nav/nav.component';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { EquipoService } from '../../../../services/equipo.service';
import { AdminService } from '../../../../services/admin.service';
import { Router } from '@angular/router';
import { JugadorService } from '../../../../services/jugador.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
declare var iziToast: any;

@Component({
  selector: 'app-archivos-nutricion',
  standalone: true,
  imports: [NavComponent, RouterModule, FormsModule, CommonModule],
  templateUrl: './archivos-nutricion.component.html',
  styleUrl: './archivos-nutricion.component.css',
})
export class ArchivosNutricionComponent implements OnInit {
  public jugadorId: string = '';
  public token: any;
  public jugador: any;
  public nombreArchivo: string = '';

  constructor(
    private _route: ActivatedRoute,
    private _equipoService: EquipoService,
    private _adminService: AdminService,
    private _jugadorService: JugadorService,
    private router: Router
  ) {
    this.token = _adminService.getToken();
  }

  ngOnInit(): void {
    this._route.paramMap.subscribe((params) => {
      this.jugadorId = params.get('id') || '';
    });

    this._jugadorService
      .obtener_jugador_admin(this.jugadorId, this.token)
      .subscribe(
        (res) => {
          this.jugador = res.data;
        },
        (err) => {
          console.error('Error al cargar jugador', err);
        }
      );
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (!file || !this.nombreArchivo.trim()) {
      iziToast.error({
        title: 'ERROR',
        message: 'Debes seleccionar un archivo y escribir un nombre.',
        position: 'topRight',
      });
      return;
    }

    this._jugadorService
      .subir_nutricion_jugador(
        this.jugadorId,
        file,
        this.nombreArchivo,
        this.token
      )
      .subscribe({
        next: (res) => {
          this.jugador.nutricion.push(res.data); // añadir al array, no reemplazar
          this.nombreArchivo = ''; // limpiar input
          iziToast.show({
            title: 'Éxito',
            message: 'El archivo fue subido correctamente',
            position: 'topRight',
            color: '#FFF',
            titleColor: '#1DC74C',
            class: 'text-success',
          });
        },
        error: (err) => {
          console.error('Error al subir archivo:', err);
          iziToast.error({
            title: 'ERROR',
            message: 'Ocurrió un error al guardar las estadísticas.',
            position: 'topRight',
            color: '#FFF',
            titleColor: '#FF0000',
            class: 'text-danger',
          });
        },
      });
  }

  eliminarArchivo(archivoId: string): void {
    this._jugadorService
      .eliminar_archivo_nutricion(this.jugadorId, archivoId, this.token)
      .subscribe({
        next: () => {
          this.jugador.nutricion = this.jugador.nutricion.filter(
            (archivo: any) => archivo._id !== archivoId
          );
          iziToast.success({
            title: 'Eliminado',
            message: 'Archivo eliminado correctamente',
            position: 'topRight',
          });
        },
        error: (err) => {
          console.error('Error al eliminar archivo:', err);
          iziToast.error({
            title: 'ERROR',
            message: 'No se pudo eliminar el archivo',
            position: 'topRight',
          });
        },
      });
  }
}
