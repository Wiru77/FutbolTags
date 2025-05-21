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
declare var iziToast: any;
declare var bootstrap: any;

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
  @Input() equipoId!: string;

  data: any[] = [];

  public filterTagText: string = '';
  public filteredTags: any[] = [];
  public filterPlayerText: string = '';
  public filteredTeam1: any[] = [];
  public filteredTeam2: any[] = [];
  public filteredTagsWithPorteria: any[] = [];
  public filteredTagsWithOfensivo: any[] = [];
  public filteredTagsWithDefensivo: any[] = [];
  public filteredBanca: any[] = [];

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
  public selectedTeam: string = 'Todos';
  public selectedTeam2: any = {};
  public token: any;
  public orderedTags: any[] = [];
  public banca: any[] = [];
  public tiempoCambio: any;
  public jugadoresEntran: any[] = [];
  public jugadoresSalen: any[] = [];

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
      this.selectTeam(storage.equipo._id, storage.equipo.nombre);
      this.selectBancaTeam(storage.equipo._id);
    }

    this.equipoId = storage.equipo._id;

    const cambiosStorage = JSON.parse(localStorage.getItem('cambios') || '[]');

    this.jugadoresEntran = cambiosStorage.map((cambio: any) => ({
      ...cambio.entra,
      tiempo_cambio: cambio.tiempo_cambio,
    }));

    this.jugadoresSalen = cambiosStorage.map((cambio: any) => cambio.sale);
  }

  initData(): void {
    this.token = this._adminService.getToken();

    this._equipoService.listar_equipos_filtro_admin(this.token).subscribe(
      (response) => {
        this.equipos = response.data;
      },
      (error) => {
        console.log(error);
      }
    );

    // Obtener los tags

    this._tagService.listar_tags_filtro_admin(this.token).subscribe(
      (response: any) => {
        this.tags = response.data;
        this.filteredTags = [...this.tags];
        this.filteredTagsWithPorteria = this.filteredTags.filter(
          (tag) => tag.porteria
        );
        this.filteredTagsWithOfensivo = this.filteredTags.filter(
          (tag) => tag.tipo === 'Ofensivo' && !tag.porteria
        );
        this.filteredTagsWithDefensivo = this.filteredTags.filter(
          (tag) => tag.tipo === 'Defensivo' && !tag.porteria
        );
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

      this.selectedPlayer2 = null;
      this.onNewPlayer.emit(this.selectedPlayer);

      this.previousButton = null;
    } else {
      if (this.previousButton) {
        this.previousButton.classList.remove('active_button');
      }

      selectedButton?.classList.add('active_button');

      this.selectedPlayer = {
        equipo: this.selectedTeam,
        localty: localty,
        jugador: {
          nombre: jugador.nombre || '',
          numero: jugador.numero || '',
          posicion: jugador.posicion || '',
          edad: jugador.edad || '',
          _id: jugador._id || '',
          equipo_id: this.equipoId || '',
          titular: jugador.titular === true,
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

      this.selectedPlayer2 = null;
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
          equipo_id: this.equipoId || '',
          titular: jugador.titular === true,
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
      this.selectTeam(
        changes['selectedTeamFromMain'].currentValue._id,
        changes['selectedTeamFromMain'].currentValue.nombre
      );
    }
  }

  selectTeam(id: any, teamName: string) {
    this.selectedTeam = teamName;
    this.onTeamSelected.emit(this.selectedTeam);

    this._equipoService.listar_jugadores_formacion(id).subscribe(
      // <---- Llama al servicio para obtener la formación
      (response) => {
        if (response && response.jugadores_formacion) {
          this.equipo1 = response.jugadores_formacion;
          this.filteredTeam1 = [...this.equipo1];
        }
      },
      (error) => {
        console.error(
          'Error al obtener los jugadores de la formación del equipo 1:',
          error
        );
      }
    );
  }

  selectBancaTeam(id: any) {
    this._equipoService.listar_jugadores_banca(id).subscribe(
      (response) => {
        if (response && response.jugadores_banca) {
          this.banca = response.jugadores_banca;
          this.filteredBanca = [...this.banca];
        }
        console.log('banca', this.banca);
      },
      (error) => {
        console.error('Error al obtener los jugadores de la banca:', error);
      }
    );
  }

  sortTagsByUsage() {
    const storage = JSON.parse(localStorage.getItem('partidoData') || '{}');
    if (!storage || !storage.equipo || !storage.equipo._id) return;

    let equipoId = storage.equipo._id;

    this._equipoService.listar_stats_equipo(equipoId, this.token).subscribe(
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

  cambiarJugadores(): void {
    const jugador1 = this.selectedPlayer.jugador;
    const jugador2 = this.selectedPlayer2.jugador;

    // Validación de existencia de jugadores válidos
    if (!jugador1?._id || !jugador2?._id) {
      iziToast.error({
        title: 'ERROR',
        message:
          'Debes seleccionar dos jugadores válidos para hacer el cambio.',
        position: 'topRight',
      });
      return;
    }

    // Validar que jugador1 (el que va a entrar) no haya salido antes
    const cambiosAnteriores = JSON.parse(
      localStorage.getItem('cambios') || '[]'
    );
    const yaEntro = cambiosAnteriores.some(
      (cambio: any) => cambio.entra._id === jugador1._id
    );

    if (yaEntro) {
      iziToast.error({
        title: 'ERROR',
        message: 'Este jugador ya entro y no puede volver a salir.',
        position: 'topRight',
      });
      return;
    }

    // Validar que jugador2 (el que va a entrar) no haya salido antes

    const yaSalio = cambiosAnteriores.some(
      (cambio: any) => cambio.sale._id === jugador2._id
    );

    if (yaSalio) {
      iziToast.error({
        title: 'ERROR',
        message: 'Este jugador ya salió y no puede volver a entrar.',
        position: 'topRight',
      });
      return;
    }

    if (jugador1?.titular === true && jugador2?.titular === false) {
      this._equipoService
        .quitar_jugador_de_formacion(this.equipoId, jugador1._id, this.token)
        .subscribe(
          (response1: any) => {
            iziToast.show({
              title: 'SUCCESS',
              titleColor: '#1DC74C',
              color: '#FFF',
              class: 'text-success',
              position: 'topRight',
              message: 'Jugador 1 removido de la titularidad',
            });

            this._equipoService
              .agregar_jugador_a_formacion(
                this.equipoId,
                jugador2._id,
                this.token
              )
              .subscribe(
                (response2: any) => {
                  iziToast.show({
                    title: 'SUCCESS',
                    titleColor: '#1DC74C',
                    color: '#FFF',
                    class: 'text-success',
                    position: 'topRight',
                    message: 'Jugador 2 agregado a la titularidad',
                  });

                  // ✅ Guardar cambio en localStorage
                  const nuevoCambio = {
                    entra: jugador2,
                    sale: jugador1,
                    minutos_jugados_sale: this.tiempoCambio,
                    minutos_jugados_entra: 90 - this.tiempoCambio,
                    tiempo_cambio: this.tiempoCambio,
                  };

                  cambiosAnteriores.push(nuevoCambio);
                  localStorage.setItem(
                    'cambios',
                    JSON.stringify(cambiosAnteriores)
                  );

                  this.equipo1 = response2.equipo.formacion;
                  this.filteredTeam1 = [...this.equipo1];
                  this.banca = response2.jugadores_banca;
                  this.filteredBanca = [...this.banca];

                  const cambiosStorage = JSON.parse(
                    localStorage.getItem('cambios') || '[]'
                  );
                  this.jugadoresEntran = cambiosStorage.map((cambio: any) => ({
                    ...cambio.entra,
                    tiempo_cambio: cambio.tiempo_cambio,
                  }));
                  this.jugadoresSalen = cambiosStorage.map(
                    (cambio: any) => cambio.sale
                  );
                },
                (error2: any) => {
                  console.error('Error al agregar jugador 2:', error2);
                  iziToast.show({
                    title: 'ERROR',
                    titleColor: '#FF0000',
                    color: '#FFF',
                    class: 'text-danger',
                    position: 'topRight',
                    message: 'Error al agregar al jugador 2 a la titularidad',
                  });
                }
              );
          },
          (error1: any) => {
            console.error('Error al quitar jugador 1:', error1);
            iziToast.show({
              title: 'ERROR',
              titleColor: '#FF0000',
              color: '#FFF',
              class: 'text-danger',
              position: 'topRight',
              message: 'Error al remover al jugador 1 de la titularidad',
            });
          }
        );
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'No se cumplen las condiciones para realizar un cambio',
      });
    }
  }

  abrirConfirmacion(): void {
    if (!this.tiempoCambio || this.tiempoCambio < 1 || this.tiempoCambio > 90) {
      iziToast.show({
        title: 'Error',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'Ingresa un número válido entre 1 y 90',
      });
      return;
    }

    const tiempoModal = bootstrap.Modal.getInstance(
      document.getElementById('tiempoCambioModal')
    );
    tiempoModal?.hide();

    const confirmModal = new bootstrap.Modal(
      document.getElementById('confirmCambioModal')
    );
    confirmModal.show();
  }

  eliminarCambio(index: number): void {
    // Obtener los cambios del localStorage
    const cambios = JSON.parse(localStorage.getItem('cambios') || '[]');

    // Quitar el cambio en la posición `index`
    cambios.splice(index, 1);

    // Guardar el nuevo arreglo actualizado
    localStorage.setItem('cambios', JSON.stringify(cambios));

    // Actualizar el front
    this.jugadoresEntran = cambios.map((cambio: any) => ({
      ...cambio.entra,
      tiempo_cambio: cambio.tiempo_cambio,
    }));
    this.jugadoresSalen = cambios.map((cambio: any) => cambio.sale);
  }
}
