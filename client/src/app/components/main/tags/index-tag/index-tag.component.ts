import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavComponent } from '../../../nav/nav.component';
import { TagService } from '../../../../services/tag.service';
import { AdminService } from '../../../../services/admin.service';
import { CommonModule } from '@angular/common';
declare var iziToast: any;
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-index-tag',
  standalone: true,
  imports: [RouterModule, FormsModule, NavComponent, CommonModule],
  templateUrl: './index-tag.component.html',
  styleUrl: './index-tag.component.css',
})
export class IndexTagComponent implements OnInit {
  public tags: any = {};
  public token: any;

  constructor(
    private _tagService: TagService,
    private _adminService: AdminService,
    private _router: Router
  ) {
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
    this.initData();
  }

  initData(): void {
    let token = this._adminService.getToken();

    this._tagService.listar_tags_filtro_admin(token).subscribe(
      (response) => {
        this.tags = response.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  eliminar(id: any) {
    this._tagService.eliminar_tag_admin(id, this.token).subscribe(
      (response) => {
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#1DC74C',
          color: '#FFF',
          class: 'text-success',
          position: 'topRight',
          message: 'Se eliminó correctamente el tag',
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
