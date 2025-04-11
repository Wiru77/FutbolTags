import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent implements OnInit {
  public token: any;
  public id: any;
  public user: any = undefined;
  public user_lc: any = {};

  constructor(private _adminService: AdminService, private _router: Router) {
    this.token = localStorage.getItem('token');
    this.id = localStorage.getItem('_id');

    if (localStorage.getItem('user_data') !== null) {
      this.user_lc = JSON.parse(localStorage.getItem('user_data') as string);
    } else {
      this.user_lc = undefined;
    }

    this._adminService.obtener_admin(this.id, this.token).subscribe(
      (response) => {
        this._adminService.setIdUsuario(response.data._id);

        this.user = response.data;
        localStorage.setItem('user_data', JSON.stringify(this.user));
      },
      (error) => {
        this.user = undefined;
      }
    );
  }

  ngAfterViewInit(): void {
    // Este bloque se ejecuta después de que la vista se ha renderizado, puedes usarlo para actualizar los datos cuando los datos cambian en el localStorage.
    window.addEventListener('storage', (event) => {
      if (event.key === 'user_data') {
        this.user_lc = JSON.parse(localStorage.getItem('user_data') as string);
      }
    });
  }

  ngOnInit(): void {}

  logout(): void {
    localStorage.clear();
    this._router.navigate(['/']);
    window.location.reload();
  }
}
