import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GLOBAL } from './GLOBAL';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EquipoService {
  public url;

  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  listar_equipos_filtro_admin(token: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token, // Enviar token
    });

    return this._http.get(this.url + 'listar_equipos_filtro_admin', {
      headers: headers,
    });
  }

  registro_equipo_admin(data: any, file: any, token: any): Observable<any> {
    let headers = new HttpHeaders({
      Authorization: token,
    });

    const fd = new FormData();
    fd.append('nombre', data.nombre);
    fd.append('portada', file);

    return this._http.post(this.url + 'registro_equipo_admin', fd, {
      headers: headers,
    });
  }

  obtener_equipo_admin(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this._http.get(this.url + 'obtener_equipo_admin/' + id, {
      headers: headers,
    });
  }

  actualizar_equipo_admin(id: any, data: any, token: any): Observable<any> {
    if (data.portada) {
      // Headers para el envío con FormData
      let headers = new HttpHeaders({
        Authorization: token,
      });

      const fd = new FormData();
      fd.append('nombre', data.nombre);
      fd.append('id_usuario', data.id_usuario);
      fd.append('portada', data.portada);

      return this._http.put(this.url + 'actualizar_equipo_admin/' + id, fd, {
        headers: headers,
      });
    } else {
      let headers = new HttpHeaders({
        Authorization: token,
        'Content-Type': 'application/json',
      });

      return this._http.put(this.url + 'actualizar_equipo_admin/' + id, data, {
        headers: headers,
      });
    }
  }

  eliminar_equipo_admin(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this._http.delete(this.url + 'eliminar_equipo_admin/' + id, {
      headers: headers,
    });
  }

  listar_jugadores_asignados(id: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.get(this.url + 'listar_jugadores_asignados/' + id, {
      headers: headers,
    });
  }

  agregar_jugador_a_equipo(
    id: any,
    jugadorId: any,
    token: any
  ): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });

    return this._http.put(
      this.url + 'agregar_jugador_a_equipo/' + id,
      { jugadores_ids: [jugadorId] }, // El backend espera un array
      { headers: headers }
    );
  }

  quitar_jugador_del_equipo(
    id: any,
    jugadorId: any,
    token: any
  ): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });

    return this._http.put(
      this.url + 'quitar_jugador_del_equipo/' + id,
      { jugadores_ids: [jugadorId] }, // El backend espera un array
      { headers: headers }
    );
  }

  listar_stats_equipo(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this._http.get(this.url + 'listar_stats_equipo/' + id, {
      headers: headers,
    });
  }
}
