import { Component, OnInit } from '@angular/core';
import { EquipoService } from '../../../services/equipo.service';
import { AdminService } from '../../../services/admin.service';
import { JugadorService } from '../../../services/jugador.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavComponent } from '../../nav/nav.component';
import { RouterModule } from '@angular/router';
import { log } from 'console';
declare var iziToast: any;
declare var $: any;

@Component({
  selector: 'app-areamedica',
  standalone: true,
  imports: [FormsModule, CommonModule, NavComponent, RouterModule],
  templateUrl: './areamedica.component.html',
  styleUrl: './areamedica.component.css',
})
export class AreamedicaComponent implements OnInit {
  public token: string;
  public equipos: any;
  public medicamentos: any;
  public nuevoMedicamento = {
    nombre: '',
    presentacion: '',
    cantidad: null,
  };

  constructor(
    private _adminService: AdminService,
    private _equipoService: EquipoService,
    private _jugadorService: JugadorService,
    private router: Router
  ) {
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
    this._equipoService.listar_equipos_filtro_admin(this.token).subscribe(
      (res: any) => {
        this.equipos = res.data;
      },
      (err: any) => {
        console.error('Error cargando equipos:', err);
      }
    );

    this._jugadorService.listar_medicamentos(this.token).subscribe(
      (res: any) => {
        this.medicamentos = res.data;
      },
      (err: any) => {
        console.error('Error cargando medicamentos:', err);
      }
    );
  }

  irADetalleEquipo(id: string) {
    this.router.navigate(['/panel/gestion/areamedica/', id]);
  }

  eliminarMedicamento(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este medicamento?')) {
      this._jugadorService.eliminar_medicamento(id, this.token).subscribe(
        (res: any) => {
          if (res.data) {
            // Recargar la lista tras eliminar
            this._jugadorService
              .listar_medicamentos(this.token)
              .subscribe((res: any) => {
                this.medicamentos = res.data;
              });
          }
        },
        (err) => {
          console.error('Error al eliminar medicamento:', err);
        }
      );
    }
  }

  registrarMedicamento() {
    if (
      this.nuevoMedicamento.nombre &&
      this.nuevoMedicamento.presentacion &&
      this.nuevoMedicamento.cantidad
    ) {
      this._jugadorService
        .registro_medicamento(this.nuevoMedicamento, this.token)
        .subscribe(
          (res: any) => {
            if (res.data) {
              iziToast.show({
                title: 'SUCCESS',
                titleColor: '#1DC74C',
                color: '#FFF',
                class: 'text-success',
                position: 'topRight',
                message: 'Medicamento registrado correctamente',
              });

              // Cerrar modal manualmente con jQuery
              $('#modalRegistrarMedicamento').modal('hide');
              $('.modal-backdrop').removeClass('show');

              // Limpiar formulario
              this.nuevoMedicamento = {
                nombre: '',
                presentacion: '',
                cantidad: null,
              };

              // Recargar la lista
              this._jugadorService
                .listar_medicamentos(this.token)
                .subscribe((res) => (this.medicamentos = res.data));
            }
          },
          (err) => {
            console.error('Error al registrar medicamento:', err);
          }
        );
    } else {
      iziToast.error({
        title: 'Error',
        message: 'Completa todos los campos',
        position: 'topRight',
      });
    }
  }
}
