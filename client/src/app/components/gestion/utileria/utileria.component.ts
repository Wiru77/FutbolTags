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
  selector: 'app-utileria',
  standalone: true,
  imports: [FormsModule, CommonModule, NavComponent, RouterModule],
  templateUrl: './utileria.component.html',
  styleUrl: './utileria.component.css',
})
export class UtileriaComponent implements OnInit {
  public token: string;
  public equipos: any;
  public materiales: any;
  public prendas: any;
  public nuevoMaterial = {
    nombre: '',
    nota: '',
    cantidad: null,
  };
  public nuevaPrenda = {
    nombre: '',
    nota: '',
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
    this._jugadorService.listar_materiales(this.token).subscribe(
      (res: any) => {
        this.materiales = res.data;
      },
      (err: any) => {
        console.error('Error cargando materiales:', err);
      }
    );
    this._jugadorService.listar_prendas(this.token).subscribe(
      (res: any) => {
        this.prendas = res.data;
      },
      (err: any) => {
        console.error('Error cargando prendas:', err);
      }
    );
  }

  irADetalleEquipo(id: string) {
    this.router.navigate(['/panel/gestion/utileria/', id]);
  }

  registrarMaterial() {
    if (
      this.nuevoMaterial.nombre &&
      this.nuevoMaterial.nota &&
      this.nuevoMaterial.cantidad
    ) {
      this._jugadorService
        .registro_material(this.nuevoMaterial, this.token)
        .subscribe(
          (res: any) => {
            if (res.data) {
              iziToast.show({
                title: 'SUCCESS',
                titleColor: '#1DC74C',
                color: '#FFF',
                class: 'text-success',
                position: 'topRight',
                message: 'Material registrado correctamente',
              });

              // Cerrar modal manualmente con jQuery
              $('#modalRegistrarMaterial').modal('hide');
              $('.modal-backdrop').removeClass('show');

              // Limpiar formulario
              this.nuevoMaterial = {
                nombre: '',
                nota: '',
                cantidad: null,
              };

              // Recargar la lista
              this._jugadorService
                .listar_materiales(this.token)
                .subscribe((res) => (this.materiales = res.data));
            }
          },
          (err) => {
            console.error('Error al registrar material:', err);
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

  registrarPrenda() {
    if (
      this.nuevaPrenda.nombre &&
      this.nuevaPrenda.nota &&
      this.nuevaPrenda.cantidad
    ) {
      this._jugadorService
        .registro_prenda(this.nuevaPrenda, this.token)
        .subscribe(
          (res: any) => {
            if (res.data) {
              iziToast.show({
                title: 'SUCCESS',
                titleColor: '#1DC74C',
                color: '#FFF',
                class: 'text-success',
                position: 'topRight',
                message: 'Prenda registrada correctamente',
              });

              // Cerrar modal manualmente con jQuery
              $('#modalRegistrarPrenda').modal('hide');
              $('.modal-backdrop').removeClass('show');

              // Limpiar formulario
              this.nuevaPrenda = {
                nombre: '',
                nota: '',
                cantidad: null,
              };

              // Recargar la lista
              this._jugadorService
                .listar_prendas(this.token)
                .subscribe((res) => (this.prendas = res.data));
            }
          },
          (err) => {
            console.error('Error al registrar prendas:', err);
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

  eliminarMaterial(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este material?')) {
      this._jugadorService.eliminar_material(id, this.token).subscribe(
        (res: any) => {
          if (res.data) {
            // Recargar la lista tras eliminar
            this._jugadorService
              .listar_materiales(this.token)
              .subscribe((res: any) => {
                this.materiales = res.data;
              });
          }
        },
        (err) => {
          console.error('Error al eliminar material:', err);
        }
      );
    }
  }

  eliminarPrenda(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este prenda?')) {
      this._jugadorService.eliminar_prenda(id, this.token).subscribe(
        (res: any) => {
          if (res.data) {
            // Recargar la lista tras eliminar
            this._jugadorService
              .listar_prendas(this.token)
              .subscribe((res: any) => {
                this.prendas = res.data;
              });
          }
        },
        (err) => {
          console.error('Error al eliminar prenda:', err);
        }
      );
    }
  }
}
