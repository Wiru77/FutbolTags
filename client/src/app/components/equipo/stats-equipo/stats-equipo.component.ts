import { Component, OnInit } from '@angular/core';
import { NavComponent } from '../../nav/nav.component';
import { FormsModule } from '@angular/forms';
import { EquipoService } from '../../../services/equipo.service';
import { JugadorService } from '../../../services/jugador.service';
import { TagService } from '../../../services/tag.service';
import { AdminService } from '../../../services/admin.service';
import { GLOBAL } from '../../../services/GLOBAL';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-stats-equipo',
  standalone: true,
  imports: [NavComponent, FormsModule, CommonModule, RouterModule, NgApexchartsModule],
  templateUrl: './stats-equipo.component.html',
  styleUrl: './stats-equipo.component.css',
})
export class StatsEquipoComponent implements OnInit {
  public token: any;
  public url;
  public id: any;
  public equipos: Array<any> = [];
  public jugadores: Array<any> = [];
  public tags: Array<any> = [];
  public jornadas: Array<any> = [];
  public localias: Array<any> = [];
  public receptores: Array<any> = [];
  public rivales: Array<any> = [];
  public stats: Array<any> = [];
  public mainStats: Array<any> = [];
  public selectedLocalia: string = '';
  public selectedTorneo: string = '';
  public selectedJornada: string = '';
  public selectedTeam: string = '';
  public selectedPlayer: string = '';
  public selectedPlayer2: string = '';
  public selectedTag: string = '';
  public selectedRival: string = '';
  public selectedTime: string = '';
  public selectedDireccion: string = '';
  public selectedCuadrantes: string = '3x3';
  public teamName: string = '';
  public efectividadStats: Array<any> = [];
  public showEfectividad: boolean = false;
  public asociacionesStats: Array<any> = [];
  public showAsociaciones: boolean = false;
  public cuadranteStats3x3: Array<any> = [];
  public cuadranteStats3x5: Array<any> = [];
  public direccionStats: Array<any> = [];
  public showCuadrantes: boolean = false;
  public jugadoresCabeceras: Array<any> = [];
  public activeTab: string = 'tablaStats';
  public playersStats:any = [];
  public totalInfo: any =[];
  chartSeries: any[] = [];
chartLabels: string[] = [];
intervalDuration = 20;
pastelPorEvento: {
  nombre: string;
  series: number[];
  options: any;
}[] = [];
selectedTags: string[] = [];


private coloresPrincipales: string[] = [
  '#f1c40f', // Amarillo
  '#3498db', // Azul
  '#2ecc71', // Verde
  '#e74c3c', // Rojo
  '#e67e22', // Naranja
  '#1abc9c', // Celeste
  '#9b59b6'  // Morado
];

  constructor(
    private _equipoService: EquipoService,
    private _jugadorService: JugadorService,
    private _tagService: TagService,
    private _adminService: AdminService,
    private _route: ActivatedRoute
  ) {
    this.token = this._adminService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.id = params['id'];

      this._equipoService.listar_jugadores_asignados(this.id).subscribe(
        (response) => {
          this.jugadores = response.data;
        },
        (error) => {
          console.log(error);
        }
      );

      this._equipoService.listar_stats_equipo(this.id, this.token).subscribe(
        (response) => {
          this.mainStats = response.data;
          this.teamName = response.equipo_nombre;
          this.stats = [...this.mainStats];
          this.playersStats = [...this.mainStats]
          

          this.totalStatsTable()

          // Extraer jornadas y receptores
          this.extractJornadas();
          this.receptores = this.extractReceptores(this.stats);
          this.extractRivales();
          this.extractLocalias();
          this.extractTorneos();
          this.calcularAsociaciones();
          this.filterStats();
          this.jugadores = this.extractJugadores(this.stats);
          this.receptores = this.extractReceptores(this.stats);
        },
        (error: any) => {
          console.error(error);
        }
      );
    });

    this._equipoService.listar_equipos_filtro_admin(this.token).subscribe(
      (response) => {
        this.equipos = response.data;
      },
      (error) => {
        console.log(error);
      }
    );

    this._tagService.listar_tags_filtro_admin(this.token).subscribe(
      (response) => {
        this.tags = response.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  totalStatsTable() {
    const allStats = this.playersStats.flatMap((player: any) => player.stats);
    
    console.log(allStats);
    
    const resumenMap = new Map<string, { nombre: string; total: number }>();
  
    for (const stat of allStats) {
      const evento = stat.evento;
      if (!evento?._id) continue;
  
      const eventoId = evento._id;
      const eventoNombre = evento.nombre || 'Sin nombre';
  
      if (!resumenMap.has(eventoId)) {
        resumenMap.set(eventoId, { nombre: eventoNombre, total: 1 });
      } else {
        resumenMap.get(eventoId)!.total += 1;
      }
    }
  
    const resumenArray = Array.from(resumenMap.entries()).map(([id, data]) => ({
      id,
      nombre: data.nombre,
      total: data.total,
    }));
  
    const totalGlobal = resumenArray.reduce((sum, item) => sum + item.total, 0);
  
    this.totalInfo = [
      { id: 'total', nombre: 'Total', total: totalGlobal },
      ...resumenArray
    ];

   this.buildLineChartStats()
  }

  
buildLineChartStats() {
  const allStats = this.playersStats.flatMap((player: any) => player.stats);

  const intervalCount = Math.ceil(90 / this.intervalDuration);

  const intervals = Array.from({ length: intervalCount }, (_, i) => {
    const start = i * this.intervalDuration;
    const end = Math.min((i + 1) * this.intervalDuration - 1, 90);
    return { label: `${start}-${end}`, start, end };
  });

  const groupedByEvento: { [tagName: string]: number[] } = {};

  for (const stat of allStats) {
    const tagName = stat.evento?.nombre || 'Sin nombre';
    const tiempo = parseInt(stat.tiempo?.split(':')[0] || '0', 10);

    const index = intervals.findIndex(i => tiempo >= i.start && tiempo <= i.end);
    if (index === -1) continue;

    if (!groupedByEvento[tagName]) {
      groupedByEvento[tagName] = new Array(intervals.length).fill(0);
    }

    groupedByEvento[tagName][index]++;
  }

  this.chartSeries = Object.entries(groupedByEvento).map(([name, data]) => ({
    name,
    data
  }));

  this.chartLabels = intervals.map(i => i.label);
}

  extractJornadas(): void {
    const jornadasSet = new Set<string>();
    this.mainStats.forEach((item) => {
      item.stats.forEach((stat: any) => {
        if (stat.jornada) {
          jornadasSet.add(stat.jornada);
        }
      });
    });
    this.jornadas = Array.from(jornadasSet);
  }

  extractLocalias(): void {
    const localiasSet = new Set<string>();
    this.mainStats.forEach((item) => {
      item.stats.forEach((stat: any) => {
        if (stat.localia) {
          localiasSet.add(stat.localia);
        }
      });
    });
    this.localias = Array.from(localiasSet);
  }

  extractJugadores(stats: any[]): any[] {
    const playersSet = new Set<string>();
    stats.forEach((item) => {
      playersSet.add(item.jugador_nombre);
    });
    return Array.from(playersSet).map((nombre) => ({ nombre }));
  }

  extractReceptores(stats: any[]): any[] {
    const receptorsSet = new Set<string>();
    stats.forEach((item) => {
      item.stats.forEach((stat: any) => {
        if (stat.receptor?.nombre) {
          receptorsSet.add(stat.receptor.nombre);
        }
      });
    });
    return Array.from(receptorsSet).map((nombre) => ({ nombre }));
  }

  extractTorneos(): string[] {
    const torneosSet = new Set<string>();
    this.mainStats.forEach((item) => {
      item.stats.forEach((stat: any) => {
        if (stat.torneo) {
          torneosSet.add(stat.torneo);
        }
      });
    });
    return Array.from(torneosSet);
  }

  extractRivales(): void {
    const rivalesSet = new Set<string>();
    this.mainStats.forEach((item) => {
      item.stats.forEach((stat: any) => {
        if (stat?.rival) {
          rivalesSet.add(stat.rival);
        }
      });
    });
    this.rivales = Array.from(rivalesSet);
  }

  filterStats(): void {
    let filteredStats = [...this.mainStats];

    // Filtrar por jornada
    if (this.selectedJornada) {
      filteredStats = filteredStats
        .map((item) => {
          return {
            ...item,
            stats: item.stats.filter(
              (stat: any) => stat.jornada === this.selectedJornada
            ),
          };
        })
        .filter((item) => item.stats.length > 0);
    }

    // Filtrar por localia
    if (this.selectedLocalia) {
      filteredStats = filteredStats
        .map((item) => {
          return {
            ...item,
            stats: item.stats.filter(
              (stat: any) => stat.localia === this.selectedLocalia
            ),
          };
        })
        .filter((item) => item.stats.length > 0);
    }

    // Filtrar por torneo
    if (this.selectedTorneo) {
      filteredStats = filteredStats
        .map((item) => {
          return {
            ...item,
            stats: item.stats.filter(
              (stat: any) => stat.torneo === this.selectedTorneo
            ),
          };
        })
        .filter((item) => item.stats.length > 0);
    }

    // Filtrar por jugador
    if (this.selectedPlayer) {
      filteredStats = filteredStats.filter(
        (item) => item.jugador_nombre === this.selectedPlayer
      );
    }

    // Filtrar por evento (tag) y agregar su contraparte fallada o exitosa
    if (this.selectedTag) {
      let selectedTagFallado = this.selectedTag.includes('Fallado')
        ? this.selectedTag.replace(' Fallado', '') // Si el tag es "Fallado", obtener su contraparte sin fallado
        : this.selectedTag + ' Fallado'; // Si el tag no es "Fallado", agregar su versión fallada

      filteredStats = filteredStats.map((item) => {
        return {
          ...item,
          stats: item.stats.filter((stat: any) => {
            // Incluir el evento seleccionado y su contraparte (fallado o exitoso)
            return (
              stat.evento.nombre === this.selectedTag ||
              stat.evento.nombre === selectedTagFallado
            );
          }),
        };
      });
    }

    // Filtrar por receptor
    if (this.selectedPlayer2) {
      filteredStats = filteredStats.map((item) => {
        return {
          ...item,
          stats: item.stats.filter(
            (stat: any) => stat.receptor.nombre === this.selectedPlayer2
          ),
        };
      });
    }

    // Filtrar por rival
    if (this.selectedRival) {
      filteredStats = filteredStats
        .map((item) => {
          return {
            ...item,
            stats: item.stats.filter(
              (stat: any) => stat.rival === this.selectedRival
            ),
          };
        })
        .filter((item) => item.stats.length > 0);
    }

    // Filtrar por tiempo
    if (this.selectedTime) {
      filteredStats = filteredStats
        .map((item) => {
          return {
            ...item,
            stats: item.stats.filter((stat: any) =>
              this.isWithinTimeRange(stat.tiempo, this.selectedTime)
            ),
          };
        })
        .filter((item) => item.stats.length > 0);
    }

    // Filtrar por dirección
    if (this.selectedDireccion) {
      filteredStats = filteredStats
        .map((item) => {
          return {
            ...item,
            stats: item.stats.filter(
              (stat: any) => stat.direccion === this.selectedDireccion
            ),
          };
        })
        .filter((item) => item.stats.length > 0);
    }

    // Actualizar stats con los datos filtrados
    this.stats = filteredStats;
    this.calcularEfectividad();
    this.calcularEventosPorCuadrante3x3();
    this.calcularEventosPorCuadrante3x5();
    this.calcularDirecciones();
  }

  private isWithinTimeRange(time: string, range: string): boolean {
    const [minutes, seconds] = time.split(':').map(Number);
    const totalSeconds = minutes * 60 + seconds;

    switch (range) {
      case '0-5':
        return totalSeconds >= 0 && totalSeconds <= 300;
      case '5-10':
        return totalSeconds >= 301 && totalSeconds <= 600;
      case '10-15':
        return totalSeconds >= 601 && totalSeconds <= 900;
      case '15-20':
        return totalSeconds >= 901 && totalSeconds <= 1200;
      case '20-25':
        return totalSeconds >= 1201 && totalSeconds <= 1500;
      case '25-30':
        return totalSeconds >= 1501 && totalSeconds <= 1800;
      case '30-35':
        return totalSeconds >= 1801 && totalSeconds <= 2100;
      case '35-40':
        return totalSeconds >= 2101 && totalSeconds <= 2400;
      case '40-45':
        return totalSeconds >= 2401 && totalSeconds <= 2700;
      case '45-50':
        return totalSeconds >= 2701 && totalSeconds <= 3000;
      case '50-55':
        return totalSeconds >= 3001 && totalSeconds <= 3300;
      case '55-60':
        return totalSeconds >= 3301 && totalSeconds <= 3600;
      case '60-65':
        return totalSeconds >= 3601 && totalSeconds <= 3900;
      case '65-70':
        return totalSeconds >= 3901 && totalSeconds <= 4200;
      case '70-75':
        return totalSeconds >= 4201 && totalSeconds <= 4500;
      case '75-80':
        return totalSeconds >= 4501 && totalSeconds <= 4800;
      case '80-85':
        return totalSeconds >= 4801 && totalSeconds <= 5100;
      case '85-90':
        return totalSeconds >= 5101 && totalSeconds <= 5400;
      case '90+':
        return totalSeconds >= 5401;
      default:
        return true;
    }
  }

  resetFilters(): void {
    // Limpiar variables de filtro
    this.selectedJornada = '';
    this.selectedTeam = '';
    this.selectedPlayer = '';
    this.selectedPlayer2 = '';
    this.selectedTag = '';
    this.selectedTime = '';
    this.selectedDireccion = '';
    this.selectedLocalia = '';
    this.selectedTorneo = '';

    // Reestablecer datos a los datos originales (this.mainStats)
    this.stats = [...this.mainStats];

    // Recalcular estadísticas basadas en los datos originales
    this.calcularEfectividad();
    this.calcularAsociaciones();
    this.calcularEventosPorCuadrante3x3();
    this.calcularEventosPorCuadrante3x5();
    this.calcularDirecciones();
  }

  calcularEfectividad(): void {
    let efectividadMap = new Map<
      string,
      { aciertos: number; fallos: number }
    >();

    // Recorrer las estadísticas para contar eventos aciertos y fallos
    this.stats.forEach((item) => {
      item.stats.forEach((stat: any) => {
        const nombreBase = stat.evento.nombre.replace(' Fallado', ''); // Quitar "Fallado"
        const esFallado = stat.evento.nombre.includes('Fallado');

        if (!efectividadMap.has(nombreBase)) {
          efectividadMap.set(nombreBase, { aciertos: 0, fallos: 0 });
        }

        if (esFallado) {
          efectividadMap.get(nombreBase)!.fallos += 1;
        } else {
          efectividadMap.get(nombreBase)!.aciertos += 1;
        }
      });
    });

    // Convertir el mapa en un array para la tabla
    this.efectividadStats = Array.from(efectividadMap.entries()).map(
      ([nombre, data]) => {
        const total = data.aciertos + data.fallos;
        const efectividad =
          total > 0 ? ((data.aciertos * 100) / total).toFixed(2) : '0.00';
    
        return {
          nombre,
          aciertos: data.aciertos,
          fallos: data.fallos,
          total,
          efectividad,
          selected: false // << Aquí lo agregas
        };
      }
    );

    // Mostrar la tabla de efectividad
    this.showEfectividad = true;
  }


  

  generarGraficaPastelPorEvento(): void {
    const seleccionados = this.efectividadStats.filter(e => e.selected);
  
    let colorIndex = 0;
  
    this.pastelPorEvento = seleccionados.map(e => {
      // Toma un color para aciertos, siguiente para fallos (o el mismo si prefieres)
      const colorAciertos = this.coloresPrincipales[colorIndex % this.coloresPrincipales.length];
      const colorFallos = this.coloresPrincipales[(colorIndex + 1) % this.coloresPrincipales.length];
      colorIndex++;
  
      return {
        nombre: e.nombre,
        series: [e.aciertos, e.fallos],
        options: {
          chart: {
            type: 'pie',
            height: 300
          },
          labels: ['Aciertos', 'Fallos'],
          colors: [colorAciertos, colorFallos],
          title: {
            text: e.nombre
          }
        }
      };
    });
  }

  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  onTagChange(event: any): void {
    const tag = event.target.value;
    if (event.target.checked) {
      this.selectedTags.push(tag);
    } else {
      this.selectedTags = this.selectedTags.filter(t => t !== tag);
    }
    console.log(this.selectedTags);
    
    this.calcularAsociaciones(); // recalcular tabla
  }


  calcularAsociaciones(): void {
    const jugadoresSet = new Set<string>();
    
    // 1. Recopilar jugadores únicos
    this.stats.forEach((item) => {
      jugadoresSet.add(item.jugador_nombre);
      item.stats.forEach((stat: any) => {
        if (stat.receptor?.nombre) {
          jugadoresSet.add(stat.receptor.nombre);
        }
      });
    });
  
    const jugadores = Array.from(jugadoresSet).sort();
  
    // 2. Inicializar el mapa de asociaciones
    const asociacionesMap = new Map<string, Map<string, number>>();
    jugadores.forEach((emisor) => {
      const receptorMap = new Map<string, number>();
      jugadores.forEach((receptor) => {
        if (emisor !== receptor) receptorMap.set(receptor, 0);
      });
      asociacionesMap.set(emisor, receptorMap);
    });
  
    // 3. Contar asociaciones (emisor → receptor)
    this.stats.forEach((item) => {
      const emisor = item.jugador_nombre;
      item.stats.forEach((stat: any) => {
        const receptor = stat.receptor?.nombre;
        if (receptor && emisor !== receptor) {
          const receptorMap = asociacionesMap.get(emisor);
          if (receptorMap?.has(receptor)) {
            receptorMap.set(receptor, receptorMap.get(receptor)! + 1);
          }
        }
      });
    });
  
    // 4. Convertir a formato de tabla para el HTML
    this.asociacionesStats = jugadores.map((emisor) => {
      const fila: any = { jugador: emisor };
      jugadores.forEach((receptor) => {
        fila[receptor] = emisor !== receptor
          ? asociacionesMap.get(emisor)?.get(receptor) || 0
          : '';
      });
      return fila;
    });
  
    // 5. Guardar cabeceras
    this.jugadoresCabeceras = jugadores;
  
    // 6. Mostrar la tabla
    this.showAsociaciones = true;
  }

  radarSeries:any = [];
  radarLabels = ['Izquierda', 'Frente', 'Derecha', 'Detrás' ];

  calcularDirecciones(): void {
    let direccionMap = new Map<string, number>();
    let totalDirecciones = 0;

    this.stats.forEach((item) => {
      item.stats.forEach((stat: any) => {
        if (stat.direccion) {
          const direccion = stat.direccion;
          direccionMap.set(direccion, (direccionMap.get(direccion) || 0) + 1);
          totalDirecciones++;
        }
      });
    });

    this.direccionStats = Array.from(direccionMap.entries()).map(
      ([direccion, cantidad]) => ({
        direccion,
        cantidad,
        porcentaje:
          totalDirecciones > 0 ? (cantidad / totalDirecciones) * 100 : 0,
      })
    );
    
    
    this.radarSeries = [{
      name: 'Direcciones',
      data: this.radarLabels.map(dir =>
        this.direccionStats.find(d => d.direccion === dir)?.cantidad || 0
      )
    }];
  }

  getCuadrante3x3(x: number, y: number): string {
    if (x <= 33.33 && y > 66.66) return 'Cuadrante 1';
    if (x > 33.33 && x <= 66.66 && y > 66.66) return 'Cuadrante 2';
    if (x > 66.66 && x <= 100 && y > 66.66) return 'Cuadrante 3';

    if (x <= 33.33 && y >= 33.33 && y <= 66.66) return 'Cuadrante 4';
    if (x > 33.33 && x <= 66.66 && y >= 33.33 && y <= 66.66)
      return 'Cuadrante 5';
    if (x > 66.66 && y >= 33.33 && y <= 66.66) return 'Cuadrante 6';

    if (x <= 33.33 && y <= 33.33) return 'Cuadrante 7';
    if (x > 33.33 && x <= 66.66 && y <= 33.33) return 'Cuadrante 8';
    if (x > 66.66 && y <= 33.33) return 'Cuadrante 9';

    return 'Desconocido';
  }

  getCuadrante3x5(x: number, y: number): string {
    if (x <= 33.33 && y > 80) return 'Cuadrante 1';
    if (x > 33.33 && x <= 66.66 && y > 80) return 'Cuadrante 2';
    if (x > 66.66 && x <= 100 && y > 80) return 'Cuadrante 3';

    if (x <= 33.33 && y > 60 && y <= 80) return 'Cuadrante 4';
    if (x > 33.33 && x <= 66.66 && y > 60 && y <= 80) return 'Cuadrante 5';
    if (x > 66.66 && x <= 100 && y > 60 && y <= 80) return 'Cuadrante 6';

    if (x <= 33.33 && y > 40 && y <= 60) return 'Cuadrante 7';
    if (x > 33.33 && x <= 66.66 && y > 40 && y <= 60) return 'Cuadrante 8';
    if (x > 66.66 && x <= 100 && y > 40 && y <= 60) return 'Cuadrante 9';

    if (x <= 33.33 && y > 20 && y <= 40) return 'Cuadrante 10';
    if (x > 33.33 && x <= 66.66 && y > 20 && y <= 40) return 'Cuadrante 11';
    if (x > 66.66 && x <= 100 && y > 20 && y <= 40) return 'Cuadrante 12';

    if (x <= 33.33 && y <= 20) return 'Cuadrante 13';
    if (x > 33.33 && x <= 66.66 && y <= 20) return 'Cuadrante 14';
    if (x > 66.66 && x <= 100 && y <= 20) return 'Cuadrante 15';

    return 'Desconocido';
  }

  calcularEventosPorCuadrante3x3(): void {
    let cuadranteMap = new Map<string, number>();
    let totalEventos = 0;

    const cuadrantes = [
      'Cuadrante 1',
      'Cuadrante 2',
      'Cuadrante 3',
      'Cuadrante 4',
      'Cuadrante 5',
      'Cuadrante 6',
      'Cuadrante 7',
      'Cuadrante 8',
      'Cuadrante 9',
    ];

    cuadrantes.forEach((cuadrante) => cuadranteMap.set(cuadrante, 0));

    this.stats.forEach((item) => {
      item.stats.forEach((stat: any) => {
        const cuadrante = this.getCuadrante3x3(stat.x, stat.y);
        cuadranteMap.set(cuadrante, (cuadranteMap.get(cuadrante) || 0) + 1);
        totalEventos++;
      });
    });

    this.cuadranteStats3x3 = cuadrantes.map((cuadrante) => ({
      cuadrante,
      eventos: cuadranteMap.get(cuadrante) || 0,
      porcentaje:
        totalEventos > 0
          ? ((cuadranteMap.get(cuadrante) || 0) / totalEventos) * 100
          : 0,
    }));

    const porcentajesConIndice = this.cuadranteStats3x3.map((stat, index) => ({
      porcentaje: stat.porcentaje,
      indice: index,
    }));

    porcentajesConIndice.sort((a, b) => b.porcentaje - a.porcentaje);

    this.cuadranteStats3x3.forEach((stat, indexOriginal) => {
      const ranking = porcentajesConIndice.findIndex(
        (item) => item.indice === indexOriginal
      );
      stat.class = `element-porcentaje-${ranking + 1}`;
    });

    this.showCuadrantes = true;
  }

  calcularEventosPorCuadrante3x5(): void {
    let cuadranteMap = new Map<string, number>();
    let totalEventos = 0;

    const cuadrantes = [
      'Cuadrante 1',
      'Cuadrante 2',
      'Cuadrante 3',
      'Cuadrante 4',
      'Cuadrante 5',
      'Cuadrante 6',
      'Cuadrante 7',
      'Cuadrante 8',
      'Cuadrante 9',
      'Cuadrante 10',
      'Cuadrante 11',
      'Cuadrante 12',
      'Cuadrante 13',
      'Cuadrante 14',
      'Cuadrante 15',
    ];

    cuadrantes.forEach((cuadrante) => cuadranteMap.set(cuadrante, 0));

    this.stats.forEach((item) => {
      item.stats.forEach((stat: any) => {
        const cuadrante = this.getCuadrante3x5(stat.x, stat.y);
        cuadranteMap.set(cuadrante, (cuadranteMap.get(cuadrante) || 0) + 1);
        totalEventos++;
      });
    });

    this.cuadranteStats3x5 = cuadrantes.map((cuadrante) => ({
      cuadrante,
      eventos: cuadranteMap.get(cuadrante) || 0,
      porcentaje:
        totalEventos > 0
          ? ((cuadranteMap.get(cuadrante) || 0) / totalEventos) * 100
          : 0,
    }));

    const porcentajesConIndice = this.cuadranteStats3x5.map((stat, index) => ({
      porcentaje: stat.porcentaje,
      indice: index,
    }));

    porcentajesConIndice.sort((a, b) => b.porcentaje - a.porcentaje);

    this.cuadranteStats3x5.forEach((stat, indexOriginal) => {
      const ranking = porcentajesConIndice.findIndex(
        (item) => item.indice === indexOriginal
      );
      stat.class = `cuadrante-porcentaje-${ranking + 1}`;
    });

    this.showCuadrantes = true;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  getTags(): any[] {
    if (this.activeTab === 'asociaciones') {
      return this.tags.filter((tag) => tag.asociacion);
    }

    if (this.activeTab === 'efectividad') {
      return this.tags.filter((tag) => tag.efectividad);
    }

    if (this.activeTab === 'tendencias') {
      return this.tags.filter((tag) => tag.tendencia);
    }
    return this.tags;
  }
}
