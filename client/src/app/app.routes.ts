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
    ],
  },

  { path: 'login', component: LoginComponent },
];
