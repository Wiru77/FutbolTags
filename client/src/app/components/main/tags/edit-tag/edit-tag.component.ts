import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../services/admin.service';
import { TagService } from '../../../../services/tag.service';
import { NgClass, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GLOBAL } from '../../../../services/GLOBAL';
import { NavComponent } from '../../../nav/nav.component';
declare var iziToast: any;

@Component({
  selector: 'app-edit-tag',
  standalone: true,
  imports: [RouterModule, FormsModule, NgClass, CommonModule, NavComponent],
  templateUrl: './edit-tag.component.html',
  styleUrl: './edit-tag.component.css',
})
export class EditTagComponent implements OnInit {
  public tag: any = {};
  public id: any;
  public token: any;
  public url: any;
  public load_btn = false;
  public tipos: Array<string> = ['Ofensivo', 'Defensivo'];

  constructor(
    private _route: ActivatedRoute,
    private _tagService: TagService,
    private _adminService: AdminService,
    private _router: Router
  ) {
    this.token = this._adminService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      this._tagService.obtener_tag_admin(this.id, this.token).subscribe(
        (response) => {
          console.log(response);
          if (response.data === undefined) {
            this.tag = undefined;
          } else {
            this.tag = response.data;
          }
        },
        (error: any) => {
          console.error(error);
        }
      );
    });
  }

  actualizar(updateForm: any) {
    if (updateForm.valid) {
      var data: any = {};

      data.nombre = this.tag.nombre;
      data.abreviatura = this.tag.abreviatura;
      data.efectividad = this.tag.efectividad;
      data.tipo = this.tag.tipo;
      data.efectividad = this.tag.efectividad;
      data.balon_parado = this.tag.balon_parado;
      data.tendencia = this.tag.tendencia;
      data.asociacion = this.tag.asociacion;
      data.porteria = this.tag.porteria;

      this.load_btn = true;

      this._tagService
        .actualizar_tag_admin(this.id, data, this.token)
        .subscribe(
          (response) => {
            iziToast.show({
              title: 'SUCCESS',
              titleColor: '#1DC74C',
              color: '#FFF',
              class: 'text-success',
              position: 'topRight',
              message: 'Se actualizó correctamente el nuevo tag',
            });
            this.load_btn = false;

            this._router.navigate(['/panel/tags/lista']);
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
}
