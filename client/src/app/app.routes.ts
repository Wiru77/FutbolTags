import { Routes, RouterModule } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { IndexEquipoComponent } from './components/equipo/index-equipo/index-equipo.component';
import { CreateEquipoComponent } from './components/equipo/create-equipo/create-equipo.component';
import { ModuleWithProviders } from '@angular/core';
import { EditEquipoComponent } from './components/equipo/edit-equipo/edit-equipo.component';
import { IndexJugadorComponent } from './components/jugadores/index-jugador/index-jugador.component';
import { CreateJugadorComponent } from './components/jugadores/create-jugador/create-jugador.component';
import { EditJugadorComponent } from './components/jugadores/edit-jugador/edit-jugador.component';
import { MainComponent } from './components/main/main.component';
import { CreateTagComponent } from './components/main/tags/create-tag/create-tag.component';
import { IndexTagComponent } from './components/main/tags/index-tag/index-tag.component';
import { EditTagComponent } from './components/main/tags/edit-tag/edit-tag.component';
import { IndexStatsComponent } from './components/stats/index-stats/index-stats.component';
import { StatsEquipoComponent } from './components/equipo/stats-equipo/stats-equipo.component';
import { GestionComponent } from './components/gestion/gestion.component';
import { AdministracionComponent } from './components/gestion/administracion/administracion.component';
import { AreamedicaComponent } from './components/gestion/areamedica/areamedica.component';
import { CategoriasComponent } from './components/gestion/categorias/categorias.component';
import { CuerpotecnicoComponent } from './components/gestion/cuerpotecnico/cuerpotecnico.component';
import { FisioterapiaComponent } from './components/gestion/fisioterapia/fisioterapia.component';
import { IntdeportivaComponent } from './components/gestion/intdeportiva/intdeportiva.component';
import { NutricionComponent } from './components/gestion/nutricion/nutricion.component';
import { PorterosComponent } from './components/gestion/porteros/porteros.component';
import { PrepfisicaComponent } from './components/gestion/prepfisica/prepfisica.component';
import { PsicologiaComponent } from './components/gestion/psicologia/psicologia.component';
import { SecretecnicaComponent } from './components/gestion/secretecnica/secretecnica.component';
import { TacticoComponent } from './components/gestion/tactico/tactico.component';
import { UtileriaComponent } from './components/gestion/utileria/utileria.component';
import { PartidosComponent } from './components/gestion/partidos/partidos.component';
import { VisoriasComponent } from './components/gestion/visorias/visorias.component';
import { PrensaComponent } from './components/gestion/prensa/prensa.component';
import { DeshumanoComponent } from './components/gestion/deshumano/deshumano.component';
import { CasaclubComponent } from './components/gestion/casaclub/casaclub.component';
import { JugadoresAdministracionComponent } from './components/gestion/administracion/jugadores-administracion/jugadores-administracion.component';
import { JugadoresAreamedicaComponent } from './components/gestion/areamedica/jugadores-areamedica/jugadores-areamedica.component';
import { JugadoresCasaclubComponent } from './components/gestion/casaclub/jugadores-casaclub/jugadores-casaclub.component';
import { JugadoresCategoriasComponent } from './components/gestion/categorias/jugadores-categorias/jugadores-categorias.component';
import { JugadoresCuerpotecnicoComponent } from './components/gestion/cuerpotecnico/jugadores-cuerpotecnico/jugadores-cuerpotecnico.component';
import { JugadoresDeshumanoComponent } from './components/gestion/deshumano/jugadores-deshumano/jugadores-deshumano.component';
import { JugadoresFisioterapiaComponent } from './components/gestion/fisioterapia/jugadores-fisioterapia/jugadores-fisioterapia.component';
import { JugadoresIntdeportivaComponent } from './components/gestion/intdeportiva/jugadores-intdeportiva/jugadores-intdeportiva.component';
import { JugadoresNutricionComponent } from './components/gestion/nutricion/jugadores-nutricion/jugadores-nutricion.component';
import { JugadoresPartidosComponent } from './components/gestion/partidos/jugadores-partidos/jugadores-partidos.component';
import { JugadoresPorterosComponent } from './components/gestion/porteros/jugadores-porteros/jugadores-porteros.component';
import { JugadoresPrensaComponent } from './components/gestion/prensa/jugadores-prensa/jugadores-prensa.component';
import { JugadoresPrepfisicaComponent } from './components/gestion/prepfisica/jugadores-prepfisica/jugadores-prepfisica.component';
import { JugadoresPsicologiaComponent } from './components/gestion/psicologia/jugadores-psicologia/jugadores-psicologia.component';
import { JugadoresSecretecnicaComponent } from './components/gestion/secretecnica/jugadores-secretecnica/jugadores-secretecnica.component';
import { JugadoresTacticoComponent } from './components/gestion/tactico/jugadores-tactico/jugadores-tactico.component';
import { JugadoresUtileriaComponent } from './components/gestion/utileria/jugadores-utileria/jugadores-utileria.component';
import { JugadoresVisoriasComponent } from './components/gestion/visorias/jugadores-visorias/jugadores-visorias.component';
import { ArchivosAdministracionComponent } from './components/gestion/administracion/archivos-administracion/archivos-administracion.component';
import { ArchivosAreamedicaComponent } from './components/gestion/areamedica/archivos-areamedica/archivos-areamedica.component';
import { ArchivosCasaclubComponent } from './components/gestion/casaclub/archivos-casaclub/archivos-casaclub.component';
import { ArchivosCategoriasComponent } from './components/gestion/categorias/archivos-categorias/archivos-categorias.component';
import { ArchivosCuerpotecnicoComponent } from './components/gestion/cuerpotecnico/archivos-cuerpotecnico/archivos-cuerpotecnico.component';
import { ArchivosDeshumanoComponent } from './components/gestion/deshumano/archivos-deshumano/archivos-deshumano.component';
import { ArchivosNutricionComponent } from './components/gestion/nutricion/archivos-nutricion/archivos-nutricion.component';
import { ArchivosPartidosComponent } from './components/gestion/partidos/archivos-partidos/archivos-partidos.component';
import { ArchivosPorterosComponent } from './components/gestion/porteros/archivos-porteros/archivos-porteros.component';
import { ArchivosPrensaComponent } from './components/gestion/prensa/archivos-prensa/archivos-prensa.component';
import { ArchivosPrepfisicaComponent } from './components/gestion/prepfisica/archivos-prepfisica/archivos-prepfisica.component';
import { ArchivosPsicologiaComponent } from './components/gestion/psicologia/archivos-psicologia/archivos-psicologia.component';
import { ArchivosSecretecnicaComponent } from './components/gestion/secretecnica/archivos-secretecnica/archivos-secretecnica.component';
import { ArchivosTacticoComponent } from './components/gestion/tactico/archivos-tactico/archivos-tactico.component';
import { ArchivosUtileriaComponent } from './components/gestion/utileria/archivos-utileria/archivos-utileria.component';
import { ArchivosVisoriasComponent } from './components/gestion/visorias/archivos-visorias/archivos-visorias.component';
import { ArchivosFisioterapiaComponent } from './components/gestion/fisioterapia/archivos-fisioterapia/archivos-fisioterapia.component';
import { ArchivosIntdeportivaComponent } from './components/gestion/intdeportiva/archivos-intdeportiva/archivos-intdeportiva.component';

export const routes: Routes = [
  { path: '', component: InicioComponent },

  {
    path: 'panel',
    children: [
      { path: 'equipos', component: IndexEquipoComponent },
      { path: 'equipos/registro', component: CreateEquipoComponent },
      { path: 'equipos/:id', component: EditEquipoComponent },
      { path: 'jugadores', component: IndexJugadorComponent },
      { path: 'jugadores/registro', component: CreateJugadorComponent },
      { path: 'jugadores/:id', component: EditJugadorComponent },
      { path: 'tags', component: MainComponent },
      { path: 'tags/registro', component: CreateTagComponent },
      { path: 'tags/lista', component: IndexTagComponent },
      { path: 'tags/lista/:id', component: EditTagComponent },
      { path: 'stats', component: IndexStatsComponent },
      { path: 'equipos/stats/:id', component: StatsEquipoComponent },

      // Componentes Gestion
      { path: 'gestion', component: GestionComponent },
      { path: 'gestion/administracion', component: AdministracionComponent },
      { path: 'gestion/areamedica', component: AreamedicaComponent },
      { path: 'gestion/categorias', component: CategoriasComponent },
      { path: 'gestion/cuerpotecnico', component: CuerpotecnicoComponent },
      { path: 'gestion/fisioterapia', component: FisioterapiaComponent },
      { path: 'gestion/intdeportiva', component: IntdeportivaComponent },
      { path: 'gestion/nutricion', component: NutricionComponent },
      { path: 'gestion/porteros', component: PorterosComponent },
      { path: 'gestion/prepfisica', component: PrepfisicaComponent },
      { path: 'gestion/psicologia', component: PsicologiaComponent },
      { path: 'gestion/secretecnica', component: SecretecnicaComponent },
      { path: 'gestion/tactico', component: TacticoComponent },
      { path: 'gestion/utileria', component: UtileriaComponent },
      { path: 'gestion/partidos', component: PartidosComponent },
      { path: 'gestion/visorias', component: VisoriasComponent },
      { path: 'gestion/prensa', component: PrensaComponent },
      { path: 'gestion/deshumano', component: DeshumanoComponent },
      { path: 'gestion/casaclub', component: CasaclubComponent },

      // Componentes Gestiod ID EQUIPOS
      {
        path: 'gestion/administracion/:id',
        component: JugadoresAdministracionComponent,
      },
      {
        path: 'gestion/areamedica/:id',
        component: JugadoresAreamedicaComponent,
      },
      {
        path: 'gestion/categorias/:id',
        component: JugadoresCategoriasComponent,
      },
      {
        path: 'gestion/cuerpotecnico/:id',
        component: JugadoresCuerpotecnicoComponent,
      },
      {
        path: 'gestion/fisioterapia/:id',
        component: JugadoresFisioterapiaComponent,
      },
      {
        path: 'gestion/intdeportiva/:id',
        component: JugadoresIntdeportivaComponent,
      },
      { path: 'gestion/nutricion/:id', component: JugadoresNutricionComponent },
      { path: 'gestion/porteros/:id', component: JugadoresPorterosComponent },
      {
        path: 'gestion/prepfisica/:id',
        component: JugadoresPrepfisicaComponent,
      },
      {
        path: 'gestion/psicologia/:id',
        component: JugadoresPsicologiaComponent,
      },
      {
        path: 'gestion/secretecnica/:id',
        component: JugadoresSecretecnicaComponent,
      },
      { path: 'gestion/tactico/:id', component: JugadoresTacticoComponent },
      { path: 'gestion/utileria/:id', component: JugadoresUtileriaComponent },
      { path: 'gestion/partidos/:id', component: JugadoresPartidosComponent },
      { path: 'gestion/visorias/:id', component: JugadoresVisoriasComponent },
      { path: 'gestion/prensa/:id', component: JugadoresPrensaComponent },
      { path: 'gestion/deshumano/:id', component: JugadoresDeshumanoComponent },
      { path: 'gestion/casaclub/:id', component: JugadoresCasaclubComponent },

      // Componentes Gestion JUGADORES
      {
        path: 'gestion/administracion/:id/:id',
        component: ArchivosAdministracionComponent,
      },
      {
        path: 'gestion/areamedica/:id/:id',
        component: ArchivosAreamedicaComponent,
      },
      {
        path: 'gestion/categorias/:id/:id',
        component: ArchivosCategoriasComponent,
      },
      {
        path: 'gestion/cuerpotecnico/:id/:id',
        component: ArchivosCuerpotecnicoComponent,
      },
      {
        path: 'gestion/fisioterapia/:id/:id',
        component: ArchivosFisioterapiaComponent,
      },
      {
        path: 'gestion/intdeportiva/:id/:id',
        component: ArchivosIntdeportivaComponent,
      },
      {
        path: 'gestion/nutricion/:id/:id',
        component: ArchivosNutricionComponent,
      },
      {
        path: 'gestion/porteros/:id/:id',
        component: ArchivosPorterosComponent,
      },

      {
        path: 'gestion/psicologia/:id/:id',
        component: ArchivosPsicologiaComponent,
      },
      {
        path: 'gestion/secretecnica/:id/:id',
        component: ArchivosSecretecnicaComponent,
      },
      {
        path: 'gestion/prepfisica/:id/:id',
        component: ArchivosPrepfisicaComponent,
      },
      { path: 'gestion/tactico/:id/:id', component: ArchivosTacticoComponent },
      {
        path: 'gestion/utileria/:id/:id',
        component: ArchivosUtileriaComponent,
      },
      {
        path: 'gestion/partidos/:id/:id',
        component: ArchivosPartidosComponent,
      },
      {
        path: 'gestion/visorias/:id/:id',
        component: ArchivosVisoriasComponent,
      },
      { path: 'gestion/prensa/:id/:id', component: ArchivosPrensaComponent },
      {
        path: 'gestion/deshumano/:id/:id',
        component: ArchivosDeshumanoComponent,
      },
      {
        path: 'gestion/casaclub/:id/:id',
        component: ArchivosCasaclubComponent,
      },
    ],
  },

  { path: 'login', component: LoginComponent },
];
