import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { JugadorService } from '../../../services/jugador.service';
import { EquipoService } from '../../../services/equipo.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { forkJoin } from 'rxjs';
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
    localStorage.removeItem('cambios');
    localStorage.removeItem('tiempoPartido');
    localStorage.removeItem('invertirX');
    this.onResetTable.emit();
  }

  get reversedDataList() {
    return [...this.dataList].reverse();
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

  removeRow(item: any) {
    const index = this.dataList.indexOf(item);
    if (index > -1) {
      this.dataList.splice(index, 1);
      localStorage.setItem(
        'eventosData',
        JSON.stringify({ dataList: this.dataList })
      );
    }
  }

  guardarStats() {
    if (!this.dataList.length) {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'No hay datos para guardar.',
      });
      return;
    }

    // Crear lista de peticiones
    const observables = this.dataList.map((data: any) => {
      const statsData = {
        localia: data.localia ?? null,
        torneo: data.torneo ?? null,
        jornada: data.jornada ?? null,
        jugador_id: data.jugador1.jugador._id,
        evento: data.tag ?? null,
        receptor: data.jugador2?.jugador?._id ?? null,
        tiempo: data.time ?? null,
        direccion: data.tag?.tendencia === true ? data.direccion : null,
        rival: data.rival ?? null,
        x: data.startX ?? null,
        y: data.startY ?? null,
        x2: data.endX !== '-' ? data.endX : null,
        y2: data.endY !== '-' ? data.endY : null,
        porteriaX: data.porteriaX !== '-' ? data.porteriaX : null,
        porteriaY: data.porteriaY !== '-' ? data.porteriaY : null,
      };

      return this._jugadorService.registro_stats(statsData, this.token);
    });

    // Ejecutar todas las peticiones al mismo tiempo
    forkJoin(observables).subscribe(
      (responses) => {
        // ✅ Mostrar un solo iziToast cuando TODAS terminan correctamente
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#1DC74C',
          color: '#FFF',
          class: 'text-success',
          position: 'topRight',
          message: 'Todas las estadísticas fueron guardadas correctamente',
        });

        $('#guardarStats').modal('hide');
        $('.modal-backdrop').removeClass('show');

        localStorage.removeItem('partidoData');
        localStorage.removeItem('eventosData');
        localStorage.removeItem('tiempoPartido');
        localStorage.removeItem('cambios');
        localStorage.removeItem('invertirX');

        // Guardar minutos jugados
        const cambios = JSON.parse(localStorage.getItem('cambios') || '[]');

        this._jugadorService
          .registro_minutos_jugados(
            {
              cambios,
              torneo: this.dataList[0]?.torneo ?? null,
              localia: this.dataList[0]?.localia ?? null,
              jornada: this.dataList[0]?.jornada ?? null,
              rival: this.dataList[0]?.rival ?? null,
              equipo_id: this.dataList[0]?.jugador1?.jugador?.equipo_id ?? null,
            },
            this.token
          )
          .subscribe(
            (response) => {
              localStorage.removeItem('cambios');

              if (this.equipoId) {
                this.router.navigate(['/panel/equipos/stats/', this.equipoId]);
              } else {
                console.error('Equipo ID no disponible.');
              }
            },
            (error) => {
              console.error('Error al guardar minutos jugados:', error);
            }
          );
      },
      (error) => {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'Ocurrió un error al guardar las estadísticas.',
        });
      }
    );
  }
}
