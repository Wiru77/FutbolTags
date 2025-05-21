import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GLOBAL } from './GLOBAL';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class JugadorService {
  public url;

  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  listar_jugadores_filtro_admin(token: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token, // Enviar token
    });

    return this._http.get(this.url + 'listar_jugadores_filtro_admin', {
      headers: headers,
    });
  }

  registro_jugador_admin(data: any, file: any, token: any): Observable<any> {
    let headers = new HttpHeaders({
      Authorization: token,
    });

    const fd = new FormData();
    fd.append('nombre', data.nombre);
    fd.append('numero', data.numero);
    fd.append('posicion', data.posicion);
    fd.append('fecha_nacimiento', data.fecha_nacimiento);
    fd.append('edad', data.edad);
    fd.append('portada', file);
    fd.append('equipo_id', data.equipo_id);

    return this._http.post(this.url + 'registro_jugador_admin', fd, {
      headers: headers,
    });
  }

  obtener_jugador_admin(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this._http.get(this.url + 'obtener_jugador_admin/' + id, {
      headers: headers,
    });
  }

  actualizar_jugador_admin(id: any, data: any, token: any): Observable<any> {
    if (data.portada) {
      // Headers para el envío con FormData
      let headers = new HttpHeaders({
        Authorization: token,
      });

      const fd = new FormData();
      fd.append('nombre', data.nombre);
      fd.append('numero', data.numero);
      fd.append('posicion', data.posicion);
      fd.append('fecha_nacimiento', data.fecha_nacimiento);
      fd.append('edad', data.edad);
      fd.append('portada', data.portada);
      fd.append('stats', data.stats);

      return this._http.put(this.url + 'actualizar_jugador_admin/' + id, fd, {
        headers: headers,
      });
    } else {
      let headers = new HttpHeaders({
        Authorization: token,
        'Content-Type': 'application/json',
      });

      return this._http.put(this.url + 'actualizar_jugador_admin/' + id, data, {
        headers: headers,
      });
    }
  }

  eliminar_jugador_admin(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this._http.delete(this.url + 'eliminar_jugador_admin/' + id, {
      headers: headers,
    });
  }

  obtener_jugadores_no_asignado(): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.get(this.url + 'obtener_jugadores_no_asignado/', {
      headers: headers,
    });
  }

  registro_stats(data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });

    return this._http.post(this.url + 'registro_stats/', data, {
      headers: headers,
    });
  }

  registro_minutos_jugados(data: any, token: string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this._http.post(this.url + 'registro_minutos_jugados', data, {
      headers: headers,
    });
  }
}
