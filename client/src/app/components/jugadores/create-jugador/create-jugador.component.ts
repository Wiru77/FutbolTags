import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; // Importa Router aquí
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { JugadorService } from '../../../services/jugador.service';
import { AdminService } from '../../../services/admin.service';
import { NavComponent } from '../../nav/nav.component';
import { EquipoService } from '../../../services/equipo.service';
import { getFips } from 'node:crypto';
declare var iziToast: any;

@Component({
  selector: 'app-create-equipo',
  standalone: true,
  imports: [RouterModule, FormsModule, NavComponent, CommonModule],
  templateUrl: './create-jugador.component.html',
  styleUrl: './create-jugador.component.css',
})
export class CreateJugadorComponent implements OnInit {
  public jugador: any = {};
  public equipos: any = [];
  public token: any;
  public file: File | null = null;
  public imgSelect: any | ArrayBuffer = 'assets/img/barrio.jpg';

  constructor(
    private _jugadorService: JugadorService,
    private _adminService: AdminService,
    private _router: Router,
    private _equipoService: EquipoService
  ) {
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
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

  registro(registroForm: any) {
    if (registroForm.valid) {
      console.log('Datos del jugador a enviar:', this.jugador);
      this._jugadorService
        .registro_jugador_admin(this.jugador, this.file, this.token)
        .subscribe(
          (response: any) => {
            iziToast.show({
              title: 'SUCCESS',
              titleColor: '#1DC74C',
              color: '#FFF',
              class: 'text-success',
              position: 'topRight',
              message: 'Se registró correctamente el nuevo jugador',
            });
            this._router.navigate(['/panel/jugadores']);
          },
          (error: any) => {
            console.log('Error en la petición:', error);
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
