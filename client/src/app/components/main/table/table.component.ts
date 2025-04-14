import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { JugadorService } from '../../../services/jugador.service';
import { EquipoService } from '../../../services/equipo.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
declare var iziToast: any;
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent implements OnInit {
  public token: any;
  public data: any;
  public nombreEquipo: any;

  @Input() dataList: any = [1];
  @Input() equipoId: string | null = null;

  @Output() public onResetTable: EventEmitter<any> = new EventEmitter();

  constructor(
    private _jugadorService: JugadorService,
    private _adminService: AdminService,
    private _equipoService: EquipoService,
    private router: Router
  ) {
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
    if (this.equipoId) {
      this._equipoService
        .obtener_equipo_admin(this.equipoId, this.token)
        .subscribe(
          (response: any) => {
            this.nombreEquipo = response.data.nombre || 'Equipo desconocido';
          },
          (error: any) => {
            console.error('Error al obtener el equipo:', error);
            this.nombreEquipo = 'Equipo no encontrado';
          }
        );
    }
  }

  resetTable() {
    localStorage.removeItem('partidoData');
    localStorage.removeItem('eventosData');
    this.onResetTable.emit();
  }

  exportTable() {
    // Crear una copia de dataList con nombres de campos personalizados
    console.log(this.dataList);

    const exportData = this.dataList.map((item: any) => ({
      Localia: item.localia,
      Direccion: item.direccion,
      Jornada: item.jornada,
      'Local o Visita': item.player1.localty,
      Equipo: item.player1.player.team,
      Jugador: `${item.player1?.player?.name ?? ''} ${
        item.player1?.player?.lastname ?? ''
      }`,
      Evento: item.tag.name, // Puedes ajustar el valor de este campo según corresponda
      Receptor: `${item.player2?.player?.name ?? ''} ${
        item.player2?.player?.lastname ?? ''
      }`,
      Tiempo: item.time,
      X: item.startX,
      Y: item.startY,
      X2: item.endX,
      Y2: item.endY,
    }));

    console.log(exportData);

    // Crear una hoja de trabajo a partir de los datos exportados
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    // Crear un libro de trabajo y añadir la hoja
    const workbook: XLSX.WorkBook = {
      Sheets: { Data: worksheet },
      SheetNames: ['Data'],
    };
    // Exportar el archivo Excel
    XLSX.writeFile(workbook, 'ExportedTable.xlsx');
  }

  removeRow(index: number) {
    this.dataList.splice(index, 1);
    localStorage.setItem(
      'eventosData',
      JSON.stringify({ dataList: this.dataList })
    );
  }

  guardarStats() {
    if (!this.dataList.length) {
      console.log('No hay datos para guardar.');
      return;
    }

    /*if (!this.data?.jugador1?.jugador?._id || !this.data?.tag) {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'Los estadísticas deben tener jugador y evento seleccionados',
      });
      return;
    }*/

    this.dataList.forEach((data: any) => {
      const statsData = {
        localia: data.localia,
        torneo: data.torneo,
        jornada: data.jornada,
        jugador_id: data.jugador1.jugador._id,
        evento: data.tag,
        receptor: data.jugador2?.jugador?._id ?? null,
        tiempo: data.time,
        direccion: data.tag?.tendencia === true ? data.direccion : null,
        rival: data.rival,
        x: data.startX,
        y: data.startY,
        x2: data.endX !== '-' ? data.endX : null,
        y2: data.endY !== '-' ? data.endY : null,
        porteriaX: data.porteriaX !== '-' ? data.porteriaX : null,
        porteriaY: data.porteriaY !== '-' ? data.porteriaY : null,
      };

      this._jugadorService.registro_stats(statsData, this.token).subscribe(
        (response) => {
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'Se guardaron correctamente las estadísticas',
          });

          $('#guardarStats').modal('hide');
          $('.modal-backdrop').removeClass('show');
          localStorage.removeItem('partidoData');
          localStorage.removeItem('eventosData');

          if (this.equipoId) {
            this.router.navigate(['/panel/equipos/stats/', this.equipoId]);
          } else {
            console.error('Equipo ID no disponible.');
          }
        },
        (error) => {
          console.log(error);
          iziToast.show({
            title: 'ERROR',
            titleColor: '#FF0000',
            color: '#FFF',
            class: 'text-danger',
            position: 'topRight',
            message: 'Error al guardar las estadísticas',
          });
        }
      );
    });
  }
}
