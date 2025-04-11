import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; // Importa Router aquí
import { FormsModule } from '@angular/forms';
import { EquipoService } from '../../../services/equipo.service';
import { AdminService } from '../../../services/admin.service';
import { NavComponent } from '../../nav/nav.component';
declare var iziToast: any;

@Component({
  selector: 'app-create-equipo',
  standalone: true,
  imports: [RouterModule, FormsModule, NavComponent],
  templateUrl: './create-equipo.component.html',
  styleUrl: './create-equipo.component.css',
})
export class CreateEquipoComponent implements OnInit {
  public equipo: any = {};
  public token: any;
  public file: File | null = null;
  public imgSelect: any | ArrayBuffer = 'assets/img/barrio.jpg';

  constructor(
    private _equipoService: EquipoService,
    private _adminService: AdminService,
    private _router: Router // Asegúrate de importar Router correctamente
  ) {
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {}

  registro(registroForm: any) {
    if (registroForm.valid) {
      console.log(this.equipo);

      this._equipoService
        .registro_equipo_admin(this.equipo, this.file, this.token)
        .subscribe(
          (response: any) => {
            iziToast.show({
              title: 'SUCCESS',
              titleColor: '#1DC74C',
              color: '#FFF',
              class: 'text-success',
              position: 'topRight',
              message: 'Se registró correctamente el nuevo equipo',
            });
            this._router.navigate(['/panel/equipos']); // Redirige al listado de equipos
          },
          (error: any) => {
            console.log(error);
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
