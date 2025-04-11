import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JugadorService } from '../../../services/jugador.service';
import { EquipoService } from '../../../services/equipo.service';
import { AdminService } from '../../../services/admin.service';
import { NgClass, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GLOBAL } from '../../../services/GLOBAL';
import { NavComponent } from '../../nav/nav.component';
declare var iziToast: any;

@Component({
  selector: 'app-edit-equipo',
  standalone: true,
  imports: [RouterModule, FormsModule, NgClass, CommonModule, NavComponent],
  templateUrl: './edit-jugador.component.html',
  styleUrl: './edit-jugador.component.css',
})
export class EditJugadorComponent implements OnInit {
  public jugador: any = {};
  public equipos: any[] = [];
  public id: any;
  public token: any;
  public imgSelect: any | ArrayBuffer = '';
  public url: any;
  public file: File | null = null;
  public load_btn = false;

  constructor(
    private _route: ActivatedRoute,
    private _jugadorService: JugadorService,
    private _equipoService: EquipoService,
    private _adminService: AdminService,
    private _router: Router
  ) {
    this.token = this._adminService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      this._jugadorService.obtener_jugador_admin(this.id, this.token).subscribe(
        (response) => {
          console.log(response);
          if (response.data === undefined) {
            this.jugador = undefined;
          } else {
            this.jugador = response.data;
            this.imgSelect =
              this.url + 'obtener_portada/' + this.jugador.portada;
          }
        },
        (error: any) => {
          console.error(error);
        }
      );
    });

    this.obtenerEquipos();
  }

  obtenerEquipos(): void {
    this._equipoService.listar_equipos_filtro_admin(this.token).subscribe(
      (response) => {
        this.equipos = response.data; // Guardar los equipos obtenidos
      },
      (error) => {
        console.log('Error al obtener los equipos:', error);
      }
    );
  }

  calcularEdad(): void {
    if (this.jugador.fecha_nacimiento) {
      const fechaNacimiento = new Date(this.jugador.fecha_nacimiento);
      const hoy = new Date();
      let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
      const mes = hoy.getMonth() - fechaNacimiento.getMonth();
      if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
        edad--;
      }
      this.jugador.edad = edad;
    } else {
      this.jugador.edad = null;
    }
  }

  actualizar(updateForm: any) {
    if (updateForm.valid) {
      var data: any = {
        nombre: this.jugador.nombre,
        numero: this.jugador.numero,
        posicion: this.jugador.posicion,
        fecha_nacimiento: this.jugador.fecha_nacimiento,
        edad: this.jugador.edad,
        equipo_id: this.jugador.equipo_id || null, // Si no hay equipo, lo guarda como null
      };

      if (this.file) {
        data.portada = this.file;
      }

      this.load_btn = true;

      this._jugadorService
        .actualizar_jugador_admin(this.id, data, this.token)
        .subscribe(
          (response) => {
            console.log('Respuesta del servidor:', response); // 👈 Verificar la respuesta de la API
            iziToast.show({
              title: 'SUCCESS',
              titleColor: '#1DC74C',
              color: '#FFF',
              class: 'text-success',
              position: 'topRight',
              message: 'Se actualizó correctamente el jugador',
            });

            this.load_btn = false;
            this._router.navigate(['/panel/jugadores']);
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
