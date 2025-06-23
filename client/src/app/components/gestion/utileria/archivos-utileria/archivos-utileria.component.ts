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
declare var $: any;

@Component({
  selector: 'app-archivos-utileria',
  standalone: true,
  imports: [NavComponent, RouterModule, FormsModule, CommonModule],
  templateUrl: './archivos-utileria.component.html',
  styleUrl: './archivos-utileria.component.css',
})
export class ArchivosUtileriaComponent implements OnInit {
  public jugadorId: string = '';
  public token: any;
  public jugador: any;
  public nombreArchivo: string = '';
  public materiales: any;
  public prendas: any;
  public asignacion = {
    material_id: '',
    prenda_id: '',
    cantidad: null,
    notas: '',
  };

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

    this._jugadorService.listar_materiales(this.token).subscribe(
      (res) => {
        this.materiales = res.data;
      },
      (err) => {
        console.error('Error al cargar jugador', err);
      }
    );

    this._jugadorService.listar_prendas(this.token).subscribe(
      (res) => {
        this.prendas = res.data;
      },
      (err) => {
        console.error('Error al cargar jugador', err);
      }
    );
  }

  asignarMaterial() {
    const { material_id, cantidad, notas } = this.asignacion;

    if (!material_id || !cantidad || cantidad <= 0) {
      iziToast.error({
        title: 'Error',
        message: 'Completa todos los campos correctamente',
        position: 'topRight',
      });
      return;
    }

    this._jugadorService
      .asignar_material_a_jugador(
        this.jugadorId,
        { material_id, cantidad, notas },
        this.token
      )
      .subscribe(
        (res: any) => {
          iziToast.success({
            title: 'Éxito',
            message: 'Material asignado correctamente',
            position: 'topRight',
          });

          // Cerrar el modal manualmente
          $('#modalAsignarMaterial').modal('hide');
          $('.modal-backdrop').removeClass('show');

          // Limpiar
          this.asignacion = {
            material_id: '',
            prenda_id: '',
            cantidad: null,
            notas: '',
          };

          // (Opcional) recargar jugador si deseas ver el cambio reflejado
          this._jugadorService
            .obtener_jugador_admin(this.jugadorId, this.token)
            .subscribe((res) => (this.jugador = res.data));
        },
        (err: any) => {
          console.error('Error al asignar material:', err);
          iziToast.error({
            title: 'Error',
            message: err.error?.message || 'No se pudo asignar el material',
            position: 'topRight',
          });
        }
      );
  }

  asignarPrenda() {
    const { prenda_id, cantidad, notas } = this.asignacion;

    if (!prenda_id || !cantidad || cantidad <= 0) {
      iziToast.error({
        title: 'Error',
        message: 'Completa todos los campos correctamente',
        position: 'topRight',
      });
      return;
    }

    this._jugadorService
      .asignar_prenda_a_jugador(
        this.jugadorId,
        { prenda_id, cantidad, notas },
        this.token
      )
      .subscribe(
        (res: any) => {
          iziToast.success({
            title: 'Éxito',
            message: 'Prenda asignada correctamente',
            position: 'topRight',
          });

          // Cerrar el modal manualmente
          $('#modalAsignarPrenda').modal('hide');
          $('.modal-backdrop').removeClass('show');

          // Limpiar
          this.asignacion = {
            material_id: '',
            prenda_id: '',
            cantidad: null,
            notas: '',
          };

          // (Opcional) recargar jugador si deseas ver el cambio reflejado
          this._jugadorService
            .obtener_jugador_admin(this.jugadorId, this.token)
            .subscribe((res) => (this.jugador = res.data));
        },
        (err: any) => {
          console.error('Error al asignar prenda:', err);
          iziToast.error({
            title: 'Error',
            message: err.error?.message || 'No se pudo asignar el prenda',
            position: 'topRight',
          });
        }
      );
  }

  eliminarAsignacionMaterial(utileriaId: string) {
    if (
      confirm(
        '¿Estás seguro de que deseas eliminar esta asignación de material?'
      )
    ) {
      this._jugadorService
        .eliminar_material_asignado(this.jugadorId, utileriaId, this.token)
        .subscribe(
          (res: any) => {
            iziToast.success({
              title: 'Eliminado',
              message: 'Material eliminado correctamente',
              position: 'topRight',
            });

            // Recargar jugador para reflejar el cambio
            this._jugadorService
              .obtener_jugador_admin(this.jugadorId, this.token)
              .subscribe((res) => (this.jugador = res.data));
          },
          (err) => {
            console.error('Error al eliminar asignación:', err);
            iziToast.error({
              title: 'Error',
              message: err.error?.message || 'No se pudo eliminar',
              position: 'topRight',
            });
          }
        );
    }
  }

  eliminarAsignacionPrenda(utileriaId: string) {
    if (
      confirm('¿Estás seguro de que deseas eliminar esta asignación de prenda?')
    ) {
      this._jugadorService
        .eliminar_prenda_asignada(this.jugadorId, utileriaId, this.token)
        .subscribe(
          (res: any) => {
            iziToast.success({
              title: 'Eliminado',
              message: 'Prenda eliminado correctamente',
              position: 'topRight',
            });

            // Recargar jugador para reflejar el cambio
            this._jugadorService
              .obtener_jugador_admin(this.jugadorId, this.token)
              .subscribe((res) => (this.jugador = res.data));
          },
          (err: any) => {
            console.error('Error al eliminar asignación:', err);
            iziToast.error({
              title: 'Error',
              message: err.error?.message || 'No se pudo eliminar',
              position: 'topRight',
            });
          }
        );
    }
  }
}
