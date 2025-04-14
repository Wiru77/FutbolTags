import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavComponent } from '../../../nav/nav.component';
import { TagService } from '../../../../services/tag.service';
import { AdminService } from '../../../../services/admin.service';
import { CommonModule } from '@angular/common';

declare var iziToast: any;

@Component({
  selector: 'app-create-tag',
  standalone: true,
  imports: [NavComponent, FormsModule, RouterModule, CommonModule],
  templateUrl: './create-tag.component.html',
  styleUrl: './create-tag.component.css',
})
export class CreateTagComponent implements OnInit {
  public token: any;
  public tipos = ['Ofensivo', 'Defensivo'];
  public tag = {
    nombre: '',
    abreviatura: '',
    tipo: '',
    efectividad: false,
    balon_parado: false,
    tendencia: false,
    asociacion: false,
    porteria: false,
  };

  constructor(
    private _tagService: TagService,
    private _adminService: AdminService,
    private _router: Router
  ) {
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {}

  registro(registroForm: any) {
    if (registroForm.valid) {
      console.log(this.tag);

      this._tagService.registro_tag_admin(this.tag, this.token).subscribe(
        (response: any) => {
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'Se registró correctamente el nuevo tag',
          });
          this._router.navigate(['/panel/tags']);
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
}
