import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EquipoService } from '../../../../services/equipo.service';
import { AdminService } from '../../../../services/admin.service';
import { RouterModule } from '@angular/router';
import { NavComponent } from '../../../nav/nav.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-jugadores-intdeportiva',
  standalone: true,
  imports: [RouterModule, NavComponent, CommonModule],
  templateUrl: './jugadores-intdeportiva.component.html',
  styleUrl: './jugadores-intdeportiva.component.css',
})
export class JugadoresIntdeportivaComponent implements OnInit {
  equipoId: string = '';
  equipo: any = null;
  jugadores: any = null;
  token: any;

  constructor(
    private _route: ActivatedRoute,
    private _equipoService: EquipoService,
    private _adminService: AdminService,
    private router: Router
  ) {
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
    this.equipoId = this._route.snapshot.params['id'];
    this._equipoService
      .obtener_equipo_admin(this.equipoId, this.token)
      .subscribe(
        (res) => {
          this.equipo = res.data;
        },
        (err) => {
          console.error('Error al cargar el equipo', err);
        }
      );

    this._equipoService.listar_jugadores_asignados(this.equipoId).subscribe(
      (res) => {
        this.jugadores = res.jugadores;
      },
      (err) => {
        console.error('Error al cargar el equipo', err);
      }
    );
    this._route.paramMap.subscribe((params) => {
      this.equipoId = params.get('id') || '';
    });
  }

  irADetalleJugador(jugadorId: string) {
    this.router.navigate([
      '/panel/gestion/intdeportiva',
      this.equipoId,
      jugadorId,
    ]);
  }
}
