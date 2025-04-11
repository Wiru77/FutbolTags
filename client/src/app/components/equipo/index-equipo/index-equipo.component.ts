import { Component, OnInit } from '@angular/core';
import { EquipoService } from '../../../services/equipo.service';
import { response } from 'express';
import { log } from 'node:console';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { GLOBAL } from '../../../services/GLOBAL';
import { NavComponent } from '../../nav/nav.component';
declare var iziToast: any;
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-index-equipo',
  standalone: true,
  imports: [
    HttpClientModule,
    FormsModule,
    CommonModule,
    RouterModule,
    NavComponent,
  ],
  templateUrl: './index-equipo.component.html',
  styleUrl: './index-equipo.component.css',
})
export class IndexEquipoComponent implements OnInit {
  public equipos: Array<any> = [];
  public token: any;
  public url;

  constructor(
    private _equipoService: EquipoService,
    private _adminService: AdminService
  ) {
    this.token = this._adminService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    this.initData();
  }

  initData(): void {
    let token = this._adminService.getToken();
    console.log('Token enviado:', token);
    this._equipoService.listar_equipos_filtro_admin(token).subscribe(
      (response) => {
        this.equipos = response.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  eliminar(id: any) {
    this._equipoService.eliminar_equipo_admin(id, this.token).subscribe(
      (response) => {
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#1DC74C',
          color: '#FFF',
          class: 'text-success',
          position: 'topRight',
          message: 'Se eliminó correctamente el nuevo equipo',
        });

        $('#delete-' + id).modal('hide');
        $('.modal-backdrop').removeClass('show');

        this.initData();
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
