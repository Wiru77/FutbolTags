import { Component, OnInit, viewChild } from '@angular/core';
import { FieldComponent } from './field/field.component';
import { GoalComponent } from './goal/goal.component';
import { TableComponent } from './table/table.component';
import { TagsComponent } from './tags/tags.component';
import { NavComponent } from '../nav/nav.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EquipoService } from '../../services/equipo.service';
import { AdminService } from '../../services/admin.service';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    FieldComponent,
    GoalComponent,
    TableComponent,
    TagsComponent,
    NavComponent,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit {
  @ViewChild(FieldComponent) fieldcomponent!: FieldComponent;

  dataList: any[] = [];
  selectedPlayer1 = {
    equipo: '',
    jugador: { nombre: '', numero: '', posicion: '', edad: '' },
  };
  selectedPlayer2 = {
    equipo: '',
    jugador: { nombre: '', numero: '', posicion: '', edad: '' },
  };
  selectedTag = {};
  coordinates = {
    startX: '-',
    startY: '-',
    endX: '-',
    endY: '-',
    porteriaX: '-',
    porteriaY: '-',
  };

  rival = '';
  time = '';
  torneo = ['Torneo Regular', 'Liguilla', ' Partido Amistoso', 'Copa'];
  jornada: string[] = [];
  direccion = '';
  localia = ['Local', 'Visitante', 'Sede'];

  day = 0;

  public datosIngresados = false;
  public token: any;
  public equipos: any;
  public selectedTeam: any;
  public selectedTeamFromModal: any = null;
  public selectedLocalia = '';
  public selectedJornada = '';
  public selectedTorneo = '';
  public equipo: any;
  public customJornada: any;

  constructor(
    private _equipoService: EquipoService,
    private _adminService: AdminService
  ) {
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
    const partidoStorage = JSON.parse(
      localStorage.getItem('partidoData') || 'null'
    );
    const eventosStorage = JSON.parse(
      localStorage.getItem('eventosData') || '{}'
    );

    if (partidoStorage) {
      this.selectedTorneo = partidoStorage.torneo || '';
      this.rival = partidoStorage.rival || '';
      this.equipo = partidoStorage.equipo || '';
      this.selectedLocalia = partidoStorage.localia || '';
      this.datosIngresados = true;
    } else {
      this.datosIngresados = false;
    }

    if (eventosStorage && eventosStorage.dataList) {
      this.dataList = eventosStorage.dataList;
    }

    this.initData();
    this.actualizarJornadas();
  }

  initData(): void {
    this._equipoService.listar_equipos_filtro_admin(this.token).subscribe(
      (response) => {
        this.equipos = response.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  confirmarDatos() {
    if (
      this.selectedTorneo &&
      this.rival &&
      this.selectedTeamFromModal &&
      this.selectedLocalia
    ) {
      const storage = JSON.parse(localStorage.getItem('eventosData') || '{}');

      const partidoData = {
        ...storage,
        torneo: this.selectedTorneo,
        rival: this.rival,
        equipo: this.selectedTeamFromModal,
        localia: this.selectedLocalia,
      };

      localStorage.setItem('partidoData', JSON.stringify(partidoData));
      this.equipo = this.selectedTeamFromModal;
      this.datosIngresados = true;
    } else {
      alert('Por favor, ingrese todos los datos');
    }
  }

  actualizarJornadas() {
    switch (this.selectedTorneo) {
      case 'Torneo Regular':
        this.jornada = [];
        break;
      case 'Liguilla':
        this.jornada = [
          'Cuartos Ida',
          'Cuartos Vuelta',
          'Semifinal Ida',
          'Semifinal Vuelta',
          'Final Ida',
          'Final Vuelta',
        ];
        break;
      case 'Copa':
        this.jornada = [
          'Fase de Grupos',
          'Dieciseisavos',
          'Octavos',
          'Cuartos',
          'Semifinal',
          'Final',
        ];
        break;
      case 'Partido Amistoso':
      default:
        this.jornada = []; // No hay jornadas para partidos amistosos
        break;
    }
  }

  onTorneoChange() {
    this.actualizarJornadas();
    this.selectedJornada = ''; // Resetear la jornada al cambiar el torneo
  }

  selectTeamModal(event: any) {
    const selectedTeamId = event.target.value;
    this.selectedTeamFromModal = this.equipos.find(
      (equipo: any) => equipo._id === selectedTeamId
    );
  }

  getEquipoId(): string | null {
    return this.equipo?._id || null;
  }

  handleTeamSelected(teamName: string) {}

  mostrarDireccion(direccion: string) {
    this.direccion = direccion;
    console.log('📌 Dirección recibida en el padre:', this.direccion);
    this.submitTag();
  }

  onNewTag(tag: any): void {
    this.selectedTag = tag;
    this.fieldcomponent.cambiarAImagenCancha();
    console.log(tag);
  }

  onCoordinatesReceived(event: {
    startX: number;
    startY: number;
    endX?: number;
    endY?: number;
    porteriaX?: number;
    porteriaY?: number;
  }) {
    this.coordinates = {
      startX: event.startX.toString(),
      startY: event.startY.toString(),
      endX: event.endX !== undefined ? event.endX.toString() : '-',
      endY: event.endY !== undefined ? event.endY.toString() : '-',
      porteriaX:
        event.porteriaX !== undefined ? event.porteriaX.toString() : '-',
      porteriaY:
        event.porteriaY !== undefined ? event.porteriaY.toString() : '-',
    };
  }

  submitTag() {
    let newData = {
      tag: this.selectedTag,
      jugador1: this.selectedPlayer1.jugador.nombre
        ? this.selectedPlayer1
        : {
            jugador: {
              nombre: '',
              numero: '',
              posicion: '',
              edad: '',
              equipo: '',
            },
          },
      jugador2: this.selectedPlayer2.jugador.nombre
        ? this.selectedPlayer2
        : {
            jugador: {
              nombre: '',
              numero: '',
              posicion: '',
              edad: '',
              equipo: '',
            },
          },
      startX: this.coordinates.startX,
      startY: this.coordinates.startY,
      endX: this.coordinates.endX,
      endY: this.coordinates.endY,
      porteriaX: this.coordinates.porteriaX,
      porteriaY: this.coordinates.porteriaY,
      rival: this.rival,
      time: this.time,
      direccion: this.direccion,
      torneo: this.selectedTorneo,
      jornada: this.selectedJornada,
      localia: this.selectedLocalia,
    };

    this.dataList.push(newData);
    localStorage.setItem(
      'eventosData',
      JSON.stringify({
        dataList: this.dataList,
        torneo: this.selectedTorneo,
        jornada: this.selectedJornada,
        rival: this.rival,
        equipo: this.equipo,
        localia: this.selectedLocalia,
      })
    );

    const eventosData = { dataList: this.dataList };

    localStorage.setItem('eventosData', JSON.stringify(eventosData));
  }

  updateLocalStorage() {
    const partidoData = {
      torneo: this.selectedTorneo,
      jornada: this.selectedJornada,
      rival: this.rival,
      equipo: this.equipo,
      localia: this.selectedLocalia,
    };
    const eventosData = {
      dataList: this.dataList,
    };
    localStorage.setItem('partidoData', JSON.stringify(partidoData));
    localStorage.setItem('eventosData', JSON.stringify(eventosData));
  }

  onNewPlayer1(player: any): void {
    this.selectedPlayer1 = player;
    console.log(player);
  }

  onNewPlayer2(player: any): void {
    this.selectedPlayer2 = player;
    console.log(player);
  }

  onDayChanged(day: number) {
    this.day = day;
  }

  onDeleteLast() {
    this.dataList.pop();
  }

  rivalChange(event: any) {
    this.rival = event.target.value;
    this.updateLocalStorage();
  }

  jornadaChange(event: any) {
    this.selectedJornada = event.target.value;
    this.updateLocalStorage();
  }

  localiaChange(event: any) {
    this.localia = event.target.value;
    this.updateLocalStorage();
  }

  torneoChange(event: any) {
    this.torneo = event.target.value;
    this.updateLocalStorage();
  }

  checkCustomJornada() {
    if (this.selectedJornada !== 'Número de Jornada') {
      this.customJornada = ''; // Limpia si selecciona otra opción
    }
  }

  updateJornada() {
    if (this.selectedTorneo === 'Torneo Regular' && this.customJornada) {
      this.selectedJornada = this.customJornada;
    }
  }

  updateSelectedJornada() {
    if (this.selectedJornada === 'Torneo Regular' && this.customJornada) {
      this.selectedJornada = this.customJornada;
    }
  }

  timeChange(event: any) {
    this.time = this.convertToTimeFormat(event.target.value);
  }

  resetTable() {
    this.dataList = [];
    window.location.reload();
  }

  convertToTimeFormat(input: string): string {
    let inputString = input.toString().replace(/\D/g, ''); // Asegurar que solo sean números

    if (inputString.length === 1) {
      return `0${inputString}:00`;
    }
    if (inputString.length === 2) {
      return `${inputString.padStart(2, '0')}:00`;
    }
    if (inputString.length === 3) {
      return `${inputString.slice(0, 2)}:${inputString
        .slice(2)
        .padStart(2, '0')}`;
    }
    if (inputString.length >= 4) {
      return `${inputString.slice(0, -2).padStart(2, '0')}:${inputString.slice(
        -2
      )}`;
    }

    return '00:00';
  }
}
