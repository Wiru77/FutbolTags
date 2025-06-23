import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EquipoService } from '../../../services/equipo.service';
import { AdminService } from '../../../services/admin.service';
import { RouterModule } from '@angular/router';
import { NavComponent } from '../../nav/nav.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-administracion',
  standalone: true,
  imports: [RouterModule, NavComponent, CommonModule],
  templateUrl: './administracion.component.html',
  styleUrl: './administracion.component.css',
})
export class AdministracionComponent implements OnInit {
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
    this.router.navigate(['/panel/gestion/administracion/', id]);
  }
}
