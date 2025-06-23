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
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-archivos-areamedica',
  standalone: true,
  imports: [NavComponent, RouterModule, FormsModule, CommonModule],
  templateUrl: './archivos-areamedica.component.html',
  styleUrl: './archivos-areamedica.component.css',
})
export class ArchivosAreamedicaComponent implements OnInit {
  public jugadorId: string = '';
  public token: any;
  public jugador: any;
  public medicamentos: any;
  public nombreArchivo: string = '';
  public asignacion = {
    medicamento_id: '',
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

    this._jugadorService.listar_medicamentos(this.token).subscribe(
      (res) => {
        this.medicamentos = res.data;
        console.log(this.medicamentos, ' yeah');
      },
      (err) => {
        console.error('Error al cargar jugador', err);
      }
    );
  }

  asignarMedicamento() {
    const { medicamento_id, cantidad, notas } = this.asignacion;

    if (!medicamento_id || !cantidad || cantidad <= 0) {
      iziToast.error({
        title: 'Error',
        message: 'Completa todos los campos correctamente',
        position: 'topRight',
      });
      return;
    }

    this._jugadorService
      .asignar_medicamento_a_jugador(
        this.jugadorId,
        { medicamento_id, cantidad, notas },
        this.token
      )
      .subscribe(
        (res: any) => {
          iziToast.success({
            title: 'Éxito',
            message: 'Medicamento asignado correctamente',
            position: 'topRight',
          });

          // Cerrar el modal manualmente
          $('#modalAsignarMedicamento').modal('hide');
          $('.modal-backdrop').removeClass('show');

          // Limpiar
          this.asignacion = {
            medicamento_id: '',
            cantidad: null,
            notas: '',
          };

          // (Opcional) recargar jugador si deseas ver el cambio reflejado
          this._jugadorService
            .obtener_jugador_admin(this.jugadorId, this.token)
            .subscribe((res) => (this.jugador = res.data));
        },
        (err) => {
          console.error('Error al asignar medicamento:', err);
          iziToast.error({
            title: 'Error',
            message: err.error?.message || 'No se pudo asignar el medicamento',
            position: 'topRight',
          });
        }
      );
  }

  eliminarAsignacionMedicamento(areaMedicaId: string) {
    if (
      confirm(
        '¿Estás seguro de que deseas eliminar esta asignación de medicamento?'
      )
    ) {
      this._jugadorService
        .eliminar_medicamento_asignado(this.jugadorId, areaMedicaId, this.token)
        .subscribe(
          (res: any) => {
            iziToast.success({
              title: 'Eliminado',
              message: 'Medicamento eliminado correctamente',
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
}
