import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NavComponent } from '../nav/nav.component';

declare var iziToast: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule, NavComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  public user: any = {};
  public usuario: any = {};
  public token: any = '';

  constructor(private _adminService: AdminService, private _router: Router) {
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
    if (this.token) {
      this._router.navigate(['/']);
    } else {
      //MANTENER EL COMPONENTE
    }
  }

  login(loginForm: NgForm) {
    if (loginForm.valid) {
      console.log(this.user);

      let data = {
        email: this.user.email,
        password: this.user.password,
      };

      this._adminService.login_admin(data).subscribe(
        (response) => {
          if (response.data == undefined) {
            iziToast.show({
              title: 'ERROR',
              titleColor: '#FF0000',
              color: '#FFF',
              class: 'text-danger',
              position: 'topRight',
              message: response.message,
            });
          } else {
            this.usuario = response.data;
            localStorage.setItem('token', response.token);
            localStorage.setItem('_id', response.data._id);
            localStorage.setItem('user_data', JSON.stringify(response.data));

            this._router.navigate(['/']);
          }
        },
        (error) => {
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
}
