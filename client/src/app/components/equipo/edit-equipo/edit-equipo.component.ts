import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EquipoService } from '../../../services/equipo.service';
import { JugadorService } from '../../../services/jugador.service';
import { AdminService } from '../../../services/admin.service';
import { NgClass, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GLOBAL } from '../../../services/GLOBAL';
import { NavComponent } from '../../nav/nav.component';
declare var iziToast: any;
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-edit-equipo',
  standalone: true,
  imports: [RouterModule, FormsModule, NgClass, CommonModule, NavComponent],
  templateUrl: './edit-equipo.component.html',
  styleUrls: ['./edit-equipo.component.css'],
})
export class EditEquipoComponent implements OnInit {
  public equipo: any = {};
  public id: any;
  public token: any;
  public jugadores: Array<any> = [];
  public asignados: Array<any> = [];
  public titulares: any[] = [];
  public suplentes: any[] = [];
  public noasignados: Array<any> = [];
  public jugadorSeleccionado: any;
  public imgSelect: any | ArrayBuffer = '';
  public url: any;
  public file: File | null = null;
  public load_btn = false;

  constructor(
    private _route: ActivatedRoute,
    private _equipoService: EquipoService,
    private _adminService: AdminService,
    private _jugadorService: JugadorService,
    private _router: Router
  ) {
    this.token = this._adminService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.id = params['id'];

      // Obtener datos del equipo
      this._equipoService.obtener_equipo_admin(this.id, this.token).subscribe(
        (response) => {
          if (response.data === undefined) {
            this.equipo = undefined;
          } else {
            this.equipo = response.data;
            this.imgSelect =
              this.url + 'obtener_portada_equipo/' + this.equipo.portada;
          }
        },
        (error: any) => {
          console.error(error);
        }
      );
    });

    // Obtener jugadores de la formacion
    this._equipoService.listar_jugadores_formacion(this.id).subscribe(
      (response) => {
        this.titulares = response.jugadores_formacion || [];
      },
      (error) => {
        console.error('Error al obtener los jugadores titulares:', error);
      }
    );

    // Obtener jugadores de la banca
    this._equipoService.listar_jugadores_banca(this.id).subscribe(
      (response) => {
        this.suplentes = response.jugadores_banca || [];
      },
      (error) => {
        console.error('Error al obtener los jugadores de la banca:', error);
      }
    );

    // Obtener jugadores asignados al equipo
    this._equipoService.listar_jugadores_asignados(this.id).subscribe(
      (response) => {
        this.asignados = response.jugadores;
      },
      (error) => {
        console.error('Error al obtener los jugadores asignados:', error);
      }
    );

    // Obtener todos los jugadores disponibles para asignar
    this._jugadorService.listar_jugadores_filtro_admin(this.token).subscribe(
      (response) => {
        this.jugadores = response.data;
      },
      (error) => {
        console.error('Error al obtener los jugadores:', error);
      }
    );
  }

  actualizar(updateForm: any) {
    if (updateForm.valid) {
      var data: any = {};

      if (this.file != undefined) {
        data.portada = this.file;
      }

      data.nombre = this.equipo.nombre;
      data.id_usuario = this.equipo.id_usuario;

      this.load_btn = true;

      this._equipoService
        .actualizar_equipo_admin(this.id, data, this.token)
        .subscribe(
          (response) => {
            iziToast.show({
              title: 'SUCCESS',
              titleColor: '#1DC74C',
              color: '#FFF',
              class: 'text-success',
              position: 'topRight',
              message: 'Se actualizó correctamente el nuevo equipo',
            });
            this.load_btn = false;

            this._router.navigate(['/panel/equipos']);
          },
          (error: any) => {
            console.error(error);
            this.load_btn = false;
          }
        );
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'Los datos del formulario no son válidos',
      });
      this.load_btn = false;
    }
  }

  abrirModal(jugador: any): void {
    this.jugadorSeleccionado = jugador;
  }

  abrirModalFormacion(titular: any): void {
    this.jugadorSeleccionado = titular;
  }

  agregar(jugador: any): void {
    $('#confirmAddModal').modal('hide');
    $('#confirmAddModal').removeClass('show');

    if (!jugador || !jugador._id) {
      console.error('Jugador inválido');
      return;
    }

    // Verificar si ya está asignado
    const yaAsignado = this.asignados.some((j) => j._id === jugador._id);
    if (yaAsignado) {
      iziToast.show({
        title: 'INFO',
        titleColor: '#FFA500',
        color: '#FFF',
        class: 'text-warning',
        position: 'topRight',
        message: 'Este jugador ya está asignado al equipo',
      });
      return;
    }

    this._equipoService
      .agregar_jugador_a_equipo(this.id, jugador._id, this.token)
      .subscribe(
        (response: any) => {
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'Jugador agregado al equipo con éxito',
          });

          // Actualizar listas
          this.asignados.push(jugador);
        },
        (error: any) => {
          console.error('Error al agregar jugador:', error);
          iziToast.show({
            title: 'ERROR',
            titleColor: '#FF0000',
            color: '#FFF',
            class: 'text-danger',
            position: 'topRight',
            message: 'Error al agregar jugador al equipo',
          });
        }
      );
  }

  quitar(jugador: any): void {
    $('#confirmRemoveModal').modal('hide');
    $('#confirmRemoveModal').removeClass('show');
    if (!jugador || !jugador._id) {
      console.error('Jugador inválido');
      return;
    }

    this._equipoService
      .quitar_jugador_del_equipo(this.id, jugador._id, this.token)
      .subscribe(
        (response: any) => {
          console.log(response);

          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'Jugador removido del equipo con éxito',
          });

          // Actualizar listas
          this.asignados = this.asignados.filter((j) => j._id !== jugador._id);
          this.noasignados.push(jugador);
        },
        (error: any) => {
          console.log(error);

          console.error('Error al remover al jugador:', error);
          iziToast.show({
            title: 'ERROR',
            titleColor: '#FF0000',
            color: '#FFF',
            class: 'text-danger',
            position: 'topRight',
            message: 'Error al remover al jugador del equipo',
          });
        }
      );
  }

  agregarAFormacion(jugador: any): void {
    $('#confirmAddModalFormacion').modal('hide');
    $('#confirmAddModalFormacion').removeClass('show');

    if (!jugador || !jugador._id) {
      console.error('Jugador inválido');
      return;
    }

    // Validación: ya está en formación
    const yaEnFormacion = this.titulares.some((j) => j._id === jugador._id);
    if (yaEnFormacion) {
      iziToast.show({
        title: 'INFO',
        titleColor: '#FFA500',
        color: '#FFF',
        class: 'text-warning',
        position: 'topRight',
        message: 'Este jugador ya está en la formación titular',
      });
      return;
    }

    // ✅ Validación: ya está en la banca
    const yaEnBanca = this.suplentes?.some((j) => j._id === jugador._id);
    if (yaEnBanca) {
      iziToast.show({
        title: 'INFO',
        titleColor: '#FFA500',
        color: '#FFF',
        class: 'text-warning',
        position: 'topRight',
        message: 'Este jugador ya está en la banca y no puede ser titular',
      });
      return;
    }

    // Enviar petición al backend
    this._equipoService
      .agregar_jugador_a_formacion(this.id, jugador._id, this.token)
      .subscribe(
        (response: any) => {
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'Jugador agregado a la formación titular',
          });

          this.titulares.push(jugador);
          console.log(this.id, jugador._id);
        },
        (error: any) => {
          console.error('Error al agregar a formación:', error);
          iziToast.show({
            title: 'ERROR',
            titleColor: '#FF0000',
            color: '#FFF',
            class: 'text-danger',
            position: 'topRight',
            message:
              error?.error?.message || 'Error al agregar jugador a formación',
          });
        }
      );
  }

  quitarDeFormacion(jugador: any): void {
    $('#confirmRemoveModalFormacion').modal('hide');
    $('#confirmRemoveModalFormacion').removeClass('show');
    if (!jugador || !jugador._id) {
      console.error('Jugador inválido');
      return;
    }

    this._equipoService
      .quitar_jugador_de_formacion(this.id, jugador._id, this.token)
      .subscribe(
        (response: any) => {
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'Jugador removido de la titularidad con éxito',
          });

          // Actualizar listas
          this.titulares = this.titulares.filter((j) => j._id !== jugador._id);
        },
        (error: any) => {
          console.log(error);

          console.error('Error al remover al jugador:', error);
          iziToast.show({
            title: 'ERROR',
            titleColor: '#FF0000',
            color: '#FFF',
            class: 'text-danger',
            position: 'topRight',
            message: 'Error al remover al jugador de la titularidad',
          });
        }
      );
  }

  agregarABanca(jugador: any): void {
    if (!jugador || !jugador._id) {
      console.error('Jugador inválido');
      return;
    }

    const yaEnBanca = this.suplentes.some((j) => j._id === jugador._id);
    if (yaEnBanca) {
      iziToast.show({
        title: 'INFO',
        titleColor: '#FFA500',
        color: '#FFF',
        class: 'text-warning',
        position: 'topRight',
        message: 'Este jugador ya está en la banca',
      });
      return;
    }

    this._equipoService
      .agregar_jugador_a_banca(this.id, jugador._id, this.token)
      .subscribe(
        (response: any) => {
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'Jugador agregado a la banca',
          });

          this.suplentes.push(jugador);
        },
        (error: any) => {
          console.error('Error al agregar a la banca:', error);
          iziToast.show({
            title: 'ERROR',
            titleColor: '#FF0000',
            color: '#FFF',
            class: 'text-danger',
            position: 'topRight',
            message: 'El jugador es titular',
          });
        }
      );
  }

  quitarDeBanca(jugador: any): void {
    if (!jugador || !jugador._id) {
      console.error('Jugador inválido');
      return;
    }

    this._equipoService
      .quitar_jugador_de_banca(this.id, jugador._id, this.token)
      .subscribe(
        (response: any) => {
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'Jugador removido de la banca con éxito',
          });

          // Actualizar listas
          this.suplentes = this.suplentes.filter((j) => j._id !== jugador._id);
        },
        (error: any) => {
          console.log(error);

          console.error('Error al remover al jugador:', error);
          iziToast.show({
            title: 'ERROR',
            titleColor: '#FF0000',
            color: '#FFF',
            class: 'text-danger',
            position: 'topRight',
            message: 'Error al remover al jugador de la banca',
          });
        }
      );
  }

  fileChangeEvent(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.file = <File>event.target.files[0];

      if (this.file.size <= 4000000) {
        if (
          this.file.type === 'image/png' ||
          this.file.type === 'image/webp' ||
          this.file.type === 'image/jpg' ||
          this.file.type === 'image/jpeg' ||
          this.file.type === 'image/gif'
        ) {
          const reader = new FileReader();
          reader.onload = () => {
            this.imgSelect = reader.result;
          };
          reader.readAsDataURL(this.file);
          console.log(this.imgSelect);
        } else {
          iziToast.show({
            title: 'ERROR',
            titleColor: '#FF0000',
            color: '#FFF',
            class: 'text-danger',
            position: 'topRight',
            message: 'El archivo debe ser una imagen válida',
          });
          this.imgSelect = 'assets/default-image.png';
          this.file = null;
        }
      } else {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'La imagen no puede superar los 4MB',
        });
        this.imgSelect = 'assets/default-image.png';
        this.file = null;
      }
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'No se seleccionó ningún archivo',
      });
      this.imgSelect = 'assets/default-image.png';
      this.file = null;
    }
  }
}
