import { Component, OnInit } from '@angular/core';
import { EquipoService } from '../../../services/equipo.service';
import { AdminService } from '../../../services/admin.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavComponent } from '../../nav/nav.component';
import { RouterModule } from '@angular/router';
import { log } from 'console';
@Component({
  selector: 'app-visorias',
  standalone: true,
  imports: [FormsModule, CommonModule, NavComponent, RouterModule],
  templateUrl: './visorias.component.html',
  styleUrl: './visorias.component.css',
})
export class VisoriasComponent implements OnInit {
  public token: string;
  public equipos: any;

  constructor(
    private _adminService: AdminService,
    private _equipoService: EquipoService,
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
  }

  irADetalleEquipo(id: string) {
    this.router.navigate(['/panel/gestion/visorias/', id]);
  }
}
