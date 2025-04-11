import { Component, OnInit } from '@angular/core';
import { JugadorService } from '../../../services/jugador.service';
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
  templateUrl: './index-jugador.component.html',
  styleUrl: './index-jugador.component.css',
})
export class IndexJugadorComponent implements OnInit {
  public jugadores: Array<any> = [];
  public token: any;
  public url;

  constructor(
    private _jugadorService: JugadorService,
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
    this._jugadorService.listar_jugadores_filtro_admin(token).subscribe(
      (response) => {
        this.jugadores = response.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  eliminar(id: any) {
    this._jugadorService.eliminar_jugador_admin(id, this.token).subscribe(
      (response) => {
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#1DC74C',
          color: '#FFF',
          class: 'text-success',
          position: 'topRight',
          message: 'Se eliminó correctamente el nuevo jugador',
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
