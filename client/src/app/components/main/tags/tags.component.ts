import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  Input,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EquipoService } from '../../../services/equipo.service';
import { TagService } from '../../../services/tag.service';
import { RouterModule } from '@angular/router';

import * as XLSX from 'xlsx';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.css',
})
export class TagsComponent implements OnInit {
  @Output() public onNewTag: EventEmitter<any> = new EventEmitter();
  @Output() public onNewPlayer: EventEmitter<any> = new EventEmitter();
  @Output() public onNewPlayer2: EventEmitter<any> = new EventEmitter();
  @Output() public onDayChanged: EventEmitter<any> = new EventEmitter();
  @Output() public onTeamSelected: EventEmitter<any> = new EventEmitter();

  @Input() public selectedTeamFromMain: any;

  data: any[] = [];

  public filterTagText: string = '';
  public filteredTags: any[] = [];
  public filterPlayerText: string = '';
  public filteredTeam1: any[] = [];
  public filteredTeam2: any[] = [];

  public previousButton: any = null;
  public previousButtonRight: any = null;
  public previousButtonTag: any = null;
  public editMode: boolean = false;
  public selectedPlayer: any = {};
  public selectedPlayer2: any = {};
  public selectedTag: any = {};
  public tags: any[] = [];
  public equipos: Array<any> = [];
  public asignados: Array<any> = [];
  public id: any;
  public selectedTeam1: string = 'Todos';
  public selectedTeam2: any = {};
  public token: any;
  public orderedTags: any[] = [];

  public equipo1: any = [{ equipo: 'Local' }];

  public equipo2: any = [{ equipo: 'Visita' }];

  constructor(
    private _equipoService: EquipoService,
    private _tagService: TagService,
    private _adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.filteredTags = [...this.tags];
    this.filteredTeam1 = [...this.equipo1];
    this.filteredTeam2 = [...this.equipo2];

    this.initData();

    const storage = JSON.parse(localStorage.getItem('partidoData') || '{}');
    if (storage && storage.equipo && storage.equipo._id) {
      // Llamar a selectTeam1 con el ID del equipo recuperado
      this.selectTeam1(storage.equipo._id, storage.equipo.nombre);
    }
  }

  initData(): void {
    let token = this._adminService.getToken();
    // Obtener los equipos
    this._equipoService.listar_equipos_filtro_admin(token).subscribe(
      (response) => {
        this.equipos = response.data;
      },
      (error) => {
        console.log(error);
      }
    );

    // Obtener los tags

    this._tagService.listar_tags_filtro_admin(token).subscribe(
      (response: any) => {
        this.tags = response.data; // Asigna los tags recibidos
        this.filteredTags = [...this.tags]; // Copia para filtrado
        this.sortTagsByUsage();
      },
      (error: any) => {
        console.error('Error al obtener los tags:', error);
      }
    );
  }

  onDayChange(e: any) {
    this.onDayChanged.emit(e.target.value);
  }

  onFileChange(event: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const target: DataTransfer = <DataTransfer>event.target;
      if (target.files.length !== 1) {
        return reject('Cannot use multiple files');
      }

      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        const binaryData: string = e.target.result;
        const workbook: XLSX.WorkBook = XLSX.read(binaryData, {
          type: 'binary',
        });

        const sheetName: string = workbook.SheetNames[0];
        const sheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

        // Convertir la hoja de cálculo a un array de objetos JSON
        let data = XLSX.utils.sheet_to_json(sheet);

        // Convertir las claves a minúsculas
        const keys = data.map((row: any) => {
          const newRow: any = {};
          Object.keys(row).forEach((key) => {
            newRow[key.toLowerCase()] = row[key]; // Convertir la clave a minúsculas
          });
          return newRow;
        });

        resolve(keys);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsBinaryString(target.files[0]);
    });
  }

  tagSelect(event: any, tag: any) {
    event.preventDefault();

    this.selectedTag = tag;

    this.onNewTag.emit(this.selectedTag);
    console.log(this.selectedTag);

    let selectedButtonTag = document.getElementById(tag.nombre);

    if (this.previousButtonTag) {
      this.previousButtonTag.classList.remove('active_button_tag');
    }

    selectedButtonTag?.classList.add('active_button_tag');

    this.previousButtonTag = selectedButtonTag;

    this.filterTagText = '';
    this.filteredTags = [...this.orderedTags];
  }

  filterTags() {
    const filterTextLower = this.filterTagText.toLowerCase();
    this.filteredTags = this.orderedTags.filter((tag) =>
      tag.nombre.toLowerCase().includes(filterTextLower)
    );
  }

  playerSelect(event: any, equipo: any, jugador: any, i: any, localty: any) {
    event.preventDefault();

    let selectedButton = document.getElementById(localty + i);

    if (selectedButton?.classList.contains('active_button_right')) {
      selectedButton.classList.remove('active_button_right');

      this.selectedPlayer2 = {
        jugador: { nombre: '', numero: '', posicion: '', edad: '', equipo: '' },
      };
      this.onNewPlayer2.emit(this.selectedPlayer2);
    }

    if (selectedButton?.classList.contains('active_button')) {
      selectedButton.classList.remove('active_button');

      this.selectedPlayer2 = {
        jugador: { nombre: '', numero: '', posicion: '', edad: '', equipo: '' },
      };
      this.onNewPlayer.emit(this.selectedPlayer);

      this.previousButton = null;
    } else {
      if (this.previousButton) {
        this.previousButton.classList.remove('active_button');
      }

      selectedButton?.classList.add('active_button');

      this.selectedPlayer = {
        equipo: this.selectedTeam1,
        localty: localty,
        jugador: {
          nombre: jugador.nombre || '',
          numero: jugador.numero || '',
          posicion: jugador.posicion || '',
          edad: jugador.edad || '',
          _id: jugador._id || '',
          equipo_id: jugador.equipo_id || '',
        },
        index: i,
      };

      this.onNewPlayer.emit(this.selectedPlayer);

      this.previousButton = selectedButton;
    }

    this.filterPlayerText = '';
    this.filteredTeam1 = [...this.equipo1];
    this.filteredTeam2 = [...this.equipo2];
  }

  playerSelect2(event: any, equipo: any, jugador: any, i: any, localty: any) {
    let test = this._adminService.getIdUsuario();

    event.preventDefault();

    let selectedButtonRight = document.getElementById(localty + i);

    if (selectedButtonRight?.classList.contains('active_button')) {
      return;
    }

    if (selectedButtonRight?.classList.contains('active_button_right')) {
      selectedButtonRight.classList.remove('active_button_right');

      this.selectedPlayer2 = {
        jugador: { nombre: '', numero: '', posicion: '', edad: '', equipo: '' },
      };
      this.onNewPlayer2.emit(this.selectedPlayer2);

      this.previousButtonRight = null;
    } else {
      if (this.previousButtonRight) {
        this.previousButtonRight.classList.remove('active_button_right');
      }

      selectedButtonRight?.classList.add('active_button_right');

      this.selectedPlayer2 = {
        equipo: this.selectedTeam2,
        localty: localty,
        jugador: {
          nombre: jugador.nombre || '',
          numero: jugador.numero || '',
          posicion: jugador.posicion || '',
          edad: jugador.edad || '',
          _id: jugador._id || '',
          equipo_id: jugador.equipo_id || '',
        },
        index: i,
      };

      this.onNewPlayer2.emit(this.selectedPlayer2);

      this.previousButtonRight = selectedButtonRight;
    }

    this.filterPlayerText = '';
    this.filteredTeam1 = this.equipo1;
    this.filteredTeam2 = this.equipo2;
  }

  filterPlayers(e: any) {
    const filter = new RegExp(e.target.value, 'i');

    this.filteredTeam1 = this.equipo1.filter((el: any) =>
      el.jugador ? filter.test(el.jugador) : filter.test(el.nombre)
    );
    this.filteredTeam2 = this.equipo2.filter((el: any) =>
      el.jugador ? filter.test(el.jugador) : filter.test(el.jugador)
    );
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['selectedTeamFromMain'] &&
      changes['selectedTeamFromMain'].currentValue
    ) {
      this.selectTeam1(
        changes['selectedTeamFromMain'].currentValue._id,
        changes['selectedTeamFromMain'].currentValue.nombre
      );
    }
  }

  selectTeam1(id: any, teamName: string) {
    this.selectedTeam1 = teamName;
    this.onTeamSelected.emit(this.selectedTeam1);
    this._equipoService.listar_jugadores_asignados(id).subscribe(
      (response) => {
        if (response && response.jugadores) {
          this.equipo1 = response.jugadores;
          this.filteredTeam1 = [...this.equipo1];
        }
      },
      (error) => {
        console.error('Error al obtener los jugadores del equipo 1:', error);
      }
    );
  }

  sortTagsByUsage() {
    const storage = JSON.parse(localStorage.getItem('partidoData') || '{}');
    if (!storage || !storage.equipo || !storage.equipo._id) return;

    let equipoId = storage.equipo._id;
    let token = this._adminService.getToken();

    this._equipoService.listar_stats_equipo(equipoId, token).subscribe(
      (response: any) => {
        if (response && response.data) {
          let jugadores = response.data;
          let tagUsage: { [key: string]: number } = {};

          jugadores.forEach((jugador: any) => {
            if (jugador && jugador.stats && Array.isArray(jugador.stats)) {
              jugador.stats.forEach((stat: any) => {
                if (stat && stat.evento && stat.evento.nombre) {
                  let eventName = stat.evento.nombre;
                  tagUsage[eventName] = (tagUsage[eventName] || 0) + 1;
                }
              });
            }
          });

          // Guardar el orden
          this.orderedTags = [...this.tags].sort(
            (a, b) => (tagUsage[b.nombre] || 0) - (tagUsage[a.nombre] || 0)
          );

          // Aplicar este orden a la lista filtrada también
          this.filteredTags = [...this.orderedTags];
        } else {
          console.error(
            'La respuesta del servicio no tiene la estructura esperada.'
          );
        }
      },
      (error) => {
        console.error('Error al obtener estadísticas:', error);
      }
    );
  }
}
