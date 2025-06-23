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
    fd.append('alias', data.alias);
    fd.append('numero', data.numero);
    fd.append('posicion', data.posicion);
    fd.append('fecha_nacimiento', data.fecha_nacimiento);
    fd.append('lugar_procedencia', data.lugar_procedencia);
    fd.append('edad', data.edad);
    fd.append('estatura', data.estatura);
    fd.append('peso', data.peso);
    fd.append('pierna_habil', data.pierna_habil);
    fd.append('equipo_procedencia', data.equipo_procedencia);
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
      fd.append('alias', data.alias);
      fd.append('numero', data.numero);
      fd.append('posicion', data.posicion);
      fd.append('fecha_nacimiento', data.fecha_nacimiento);
      fd.append('lugar_procedencia', data.lugar_procedencia);
      fd.append('edad', data.edad);
      fd.append('estatura', data.estatura);
      fd.append('peso', data.peso);
      fd.append('pierna_habil', data.pierna_habil);
      fd.append('equipo_procedencia', data.equipo_procedencia);
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

  subir_prepfisica_jugador(
    jugadorId: string,
    file: File,
    nombre: string,
    token: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: token,
    });

    const fd = new FormData();

    // Detectar el tipo de archivo
    if (file.type === 'application/pdf') {
      fd.append('pdf', file);
    } else if (file.type.startsWith('video/')) {
      fd.append('video', file);
    } else {
      console.error('Tipo de archivo no permitido');
      return new Observable((observer) => {
        observer.error('Tipo de archivo no permitido');
      });
    }

    // 👇 Aquí se añade el nombre del archivo
    fd.append('nombre', nombre);

    return this._http.post(
      this.url + 'subir_prepfisica_jugador/' + jugadorId,
      fd,
      { headers }
    );
  }

  eliminar_archivo_prepfisica(
    jugadorId: any,
    archivoId: any,
    token: any
  ): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this._http.delete(
      this.url + 'eliminar_archivo_prepfisica/' + jugadorId + '/' + archivoId,
      {
        headers: headers,
      }
    );
  }

  subir_administracion_jugador(
    jugadorId: string,
    file: File,
    nombre: string,
    token: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: token,
    });

    const fd = new FormData();

    if (file.type === 'application/pdf') {
      fd.append('pdf', file);
    } else if (file.type.startsWith('video/')) {
      fd.append('video', file);
    } else {
      console.error('Tipo de archivo no permitido');
      return new Observable((observer) => {
        observer.error('Tipo de archivo no permitido');
      });
    }

    fd.append('nombre', nombre);

    return this._http.post(
      this.url + 'subir_administracion_jugador/' + jugadorId,
      fd,
      { headers }
    );
  }

  eliminar_archivo_administracion(
    jugadorId: any,
    archivoId: any,
    token: any
  ): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this._http.delete(
      this.url +
        'eliminar_archivo_administracion/' +
        jugadorId +
        '/' +
        archivoId,
      {
        headers: headers,
      }
    );
  }

  subir_areamedica_jugador(
    jugadorId: string,
    file: File,
    nombre: string,
    token: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: token,
    });

    const fd = new FormData();

    if (file.type === 'application/pdf') {
      fd.append('pdf', file);
    } else if (file.type.startsWith('video/')) {
      fd.append('video', file);
    } else {
      console.error('Tipo de archivo no permitido');
      return new Observable((observer) => {
        observer.error('Tipo de archivo no permitido');
      });
    }

    fd.append('nombre', nombre);

    return this._http.post(
      this.url + 'subir_areamedica_jugador/' + jugadorId,
      fd,
      { headers }
    );
  }

  eliminar_archivo_areamedica(
    jugadorId: any,
    archivoId: any,
    token: any
  ): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this._http.delete(
      this.url + 'eliminar_archivo_areamedica/' + jugadorId + '/' + archivoId,
      {
        headers: headers,
      }
    );
  }

  subir_casaclub_jugador(
    jugadorId: string,
    file: File,
    nombre: string,
    token: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: token,
    });

    const fd = new FormData();

    if (file.type === 'application/pdf') {
      fd.append('pdf', file);
    } else if (file.type.startsWith('video/')) {
      fd.append('video', file);
    } else {
      console.error('Tipo de archivo no permitido');
      return new Observable((observer) => {
        observer.error('Tipo de archivo no permitido');
      });
    }

    fd.append('nombre', nombre);

    return this._http.post(
      this.url + 'subir_casaclub_jugador/' + jugadorId,
      fd,
      { headers }
    );
  }

  eliminar_archivo_casaclub(
    jugadorId: any,
    archivoId: any,
    token: any
  ): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this._http.delete(
      this.url + 'eliminar_archivo_casaclub/' + jugadorId + '/' + archivoId,
      {
        headers: headers,
      }
    );
  }

  subir_categorias_jugador(
    jugadorId: string,
    file: File,
    nombre: string,
    token: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: token,
    });

    const fd = new FormData();

    if (file.type === 'application/pdf') {
      fd.append('pdf', file);
    } else if (file.type.startsWith('video/')) {
      fd.append('video', file);
    } else {
      console.error('Tipo de archivo no permitido');
      return new Observable((observer) => {
        observer.error('Tipo de archivo no permitido');
      });
    }

    fd.append('nombre', nombre);

    return this._http.post(
      this.url + 'subir_categorias_jugador/' + jugadorId,
      fd,
      { headers }
    );
  }

  eliminar_archivo_categorias(
    jugadorId: any,
    archivoId: any,
    token: any
  ): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this._http.delete(
      this.url + 'eliminar_archivo_categorias/' + jugadorId + '/' + archivoId,
      {
        headers: headers,
      }
    );
  }

  subir_cuerpotecnico_jugador(
    jugadorId: string,
    file: File,
    nombre: string,
    token: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: token,
    });

    const fd = new FormData();

    if (file.type === 'application/pdf') {
      fd.append('pdf', file);
    } else if (file.type.startsWith('video/')) {
      fd.append('video', file);
    } else {
      console.error('Tipo de archivo no permitido');
      return new Observable((observer) => {
        observer.error('Tipo de archivo no permitido');
      });
    }

    fd.append('nombre', nombre);

    return this._http.post(
      this.url + 'subir_cuerpotecnico_jugador/' + jugadorId,
      fd,
      { headers }
    );
  }

  eliminar_archivo_cuerpotecnico(
    jugadorId: any,
    archivoId: any,
    token: any
  ): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this._http.delete(
      this.url +
        'eliminar_archivo_cuerpotecnico/' +
        jugadorId +
        '/' +
        archivoId,
      {
        headers: headers,
      }
    );
  }

  subir_deshumano_jugador(
    jugadorId: string,
    file: File,
    nombre: string,
    token: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: token,
    });

    const fd = new FormData();

    if (file.type === 'application/pdf') {
      fd.append('pdf', file);
    } else if (file.type.startsWith('video/')) {
      fd.append('video', file);
    } else {
      console.error('Tipo de archivo no permitido');
      return new Observable((observer) => {
        observer.error('Tipo de archivo no permitido');
      });
    }

    fd.append('nombre', nombre);

    return this._http.post(
      this.url + 'subir_deshumano_jugador/' + jugadorId,
      fd,
      { headers }
    );
  }

  eliminar_archivo_deshumano(
    jugadorId: any,
    archivoId: any,
    token: any
  ): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this._http.delete(
      this.url + 'eliminar_archivo_deshumano/' + jugadorId + '/' + archivoId,
      {
        headers: headers,
      }
    );
  }

  subir_fisioterapia_jugador(
    jugadorId: string,
    file: File,
    nombre: string,
    token: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: token,
    });

    const fd = new FormData();

    if (file.type === 'application/pdf') {
      fd.append('pdf', file);
    } else if (file.type.startsWith('video/')) {
      fd.append('video', file);
    } else {
      console.error('Tipo de archivo no permitido');
      return new Observable((observer) => {
        observer.error('Tipo de archivo no permitido');
      });
    }

    fd.append('nombre', nombre);

    return this._http.post(
      this.url + 'subir_fisioterapia_jugador/' + jugadorId,
      fd,
      { headers }
    );
  }

  eliminar_archivo_fisioterapia(
    jugadorId: any,
    archivoId: any,
    token: any
  ): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this._http.delete(
      this.url + 'eliminar_archivo_fisioterapia/' + jugadorId + '/' + archivoId,
      {
        headers: headers,
      }
    );
  }

  subir_intdeportiva_jugador(
    jugadorId: string,
    file: File,
    nombre: string,
    token: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: token,
    });

    const fd = new FormData();

    if (file.type === 'application/pdf') {
      fd.append('pdf', file);
    } else if (file.type.startsWith('video/')) {
      fd.append('video', file);
    } else {
      console.error('Tipo de archivo no permitido');
      return new Observable((observer) => {
        observer.error('Tipo de archivo no permitido');
      });
    }

    fd.append('nombre', nombre);

    return this._http.post(
      this.url + 'subir_intdeportiva_jugador/' + jugadorId,
      fd,
      { headers }
    );
  }

  eliminar_archivo_intdeportiva(
    jugadorId: any,
    archivoId: any,
    token: any
  ): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this._http.delete(
      this.url + 'eliminar_archivo_intdeportiva/' + jugadorId + '/' + archivoId,
      {
        headers: headers,
      }
    );
  }

  subir_nutricion_jugador(
    jugadorId: string,
    file: File,
    nombre: string,
    token: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: token,
    });

    const fd = new FormData();

    if (file.type === 'application/pdf') {
      fd.append('pdf', file);
    } else if (file.type.startsWith('video/')) {
      fd.append('video', file);
    } else {
      console.error('Tipo de archivo no permitido');
      return new Observable((observer) => {
        observer.error('Tipo de archivo no permitido');
      });
    }

    fd.append('nombre', nombre);

    return this._http.post(
      this.url + 'subir_nutricion_jugador/' + jugadorId,
      fd,
      { headers }
    );
  }

  eliminar_archivo_nutricion(
    jugadorId: any,
    archivoId: any,
    token: any
  ): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this._http.delete(
      this.url + 'eliminar_archivo_nutricion/' + jugadorId + '/' + archivoId,
      {
        headers: headers,
      }
    );
  }

  subir_partidos_jugador(
    jugadorId: string,
    file: File,
    nombre: string,
    token: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: token,
    });

    const fd = new FormData();

    if (file.type === 'application/pdf') {
      fd.append('pdf', file);
    } else if (file.type.startsWith('video/')) {
      fd.append('video', file);
    } else {
      console.error('Tipo de archivo no permitido');
      return new Observable((observer) => {
        observer.error('Tipo de archivo no permitido');
      });
    }

    fd.append('nombre', nombre);

    return this._http.post(
      this.url + 'subir_partidos_jugador/' + jugadorId,
      fd,
      { headers }
    );
  }

  eliminar_archivo_partidos(
    jugadorId: any,
    archivoId: any,
    token: any
  ): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this._http.delete(
      this.url + 'eliminar_archivo_partidos/' + jugadorId + '/' + archivoId,
      {
        headers: headers,
      }
    );
  }

  subir_porteros_jugador(
    jugadorId: string,
    file: File,
    nombre: string,
    token: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: token,
    });

    const fd = new FormData();

    if (file.type === 'application/pdf') {
      fd.append('pdf', file);
    } else if (file.type.startsWith('video/')) {
      fd.append('video', file);
    } else {
      console.error('Tipo de archivo no permitido');
      return new Observable((observer) => {
        observer.error('Tipo de archivo no permitido');
      });
    }

    fd.append('nombre', nombre);

    return this._http.post(
      this.url + 'subir_porteros_jugador/' + jugadorId,
      fd,
      { headers }
    );
  }

  eliminar_archivo_porteros(
    jugadorId: any,
    archivoId: any,
    token: any
  ): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this._http.delete(
      this.url + 'eliminar_archivo_porteros/' + jugadorId + '/' + archivoId,
      {
        headers: headers,
      }
    );
  }

  subir_prensa_jugador(
    jugadorId: string,
    file: File,
    nombre: string,
    token: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: token,
    });

    const fd = new FormData();

    if (file.type === 'application/pdf') {
      fd.append('pdf', file);
    } else if (file.type.startsWith('video/')) {
      fd.append('video', file);
    } else {
      console.error('Tipo de archivo no permitido');
      return new Observable((observer) => {
        observer.error('Tipo de archivo no permitido');
      });
    }

    fd.append('nombre', nombre);

    return this._http.post(this.url + 'subir_prensa_jugador/' + jugadorId, fd, {
      headers,
    });
  }

  eliminar_archivo_prensa(
    jugadorId: any,
    archivoId: any,
    token: any
  ): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this._http.delete(
      this.url + 'eliminar_archivo_prensa/' + jugadorId + '/' + archivoId,
      {
        headers: headers,
      }
    );
  }

  subir_psicologia_jugador(
    jugadorId: string,
    file: File,
    nombre: string,
    token: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: token,
    });

    const fd = new FormData();

    if (file.type === 'application/pdf') {
      fd.append('pdf', file);
    } else if (file.type.startsWith('video/')) {
      fd.append('video', file);
    } else {
      console.error('Tipo de archivo no permitido');
      return new Observable((observer) => {
        observer.error('Tipo de archivo no permitido');
      });
    }

    fd.append('nombre', nombre);

    return this._http.post(
      this.url + 'subir_psicologia_jugador/' + jugadorId,
      fd,
      { headers }
    );
  }

  eliminar_archivo_psicologia(
    jugadorId: any,
    archivoId: any,
    token: any
  ): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this._http.delete(
      this.url + 'eliminar_archivo_psicologia/' + jugadorId + '/' + archivoId,
      {
        headers: headers,
      }
    );
  }

  subir_secretecnica_jugador(
    jugadorId: string,
    file: File,
    nombre: string,
    token: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: token,
    });

    const fd = new FormData();

    if (file.type === 'application/pdf') {
      fd.append('pdf', file);
    } else if (file.type.startsWith('video/')) {
      fd.append('video', file);
    } else {
      console.error('Tipo de archivo no permitido');
      return new Observable((observer) => {
        observer.error('Tipo de archivo no permitido');
      });
    }

    fd.append('nombre', nombre);

    return this._http.post(
      this.url + 'subir_secretecnica_jugador/' + jugadorId,
      fd,
      { headers }
    );
  }

  eliminar_archivo_secretecnica(
    jugadorId: any,
    archivoId: any,
    token: any
  ): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this._http.delete(
      this.url + 'eliminar_archivo_secretecnica/' + jugadorId + '/' + archivoId,
      {
        headers: headers,
      }
    );
  }

  subir_tactico_jugador(
    jugadorId: string,
    file: File,
    nombre: string,
    token: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: token,
    });

    const fd = new FormData();

    if (file.type === 'application/pdf') {
      fd.append('pdf', file);
    } else if (file.type.startsWith('video/')) {
      fd.append('video', file);
    } else {
      console.error('Tipo de archivo no permitido');
      return new Observable((observer) => {
        observer.error('Tipo de archivo no permitido');
      });
    }

    fd.append('nombre', nombre);

    return this._http.post(
      this.url + 'subir_tactico_jugador/' + jugadorId,
      fd,
      { headers }
    );
  }

  eliminar_archivo_tactico(
    jugadorId: any,
    archivoId: any,
    token: any
  ): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this._http.delete(
      this.url + 'eliminar_archivo_tactico/' + jugadorId + '/' + archivoId,
      {
        headers: headers,
      }
    );
  }

  subir_utileria_jugador(
    jugadorId: string,
    file: File,
    nombre: string,
    token: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: token,
    });

    const fd = new FormData();

    if (file.type === 'application/pdf') {
      fd.append('pdf', file);
    } else if (file.type.startsWith('video/')) {
      fd.append('video', file);
    } else {
      console.error('Tipo de archivo no permitido');
      return new Observable((observer) => {
        observer.error('Tipo de archivo no permitido');
      });
    }

    fd.append('nombre', nombre);

    return this._http.post(
      this.url + 'subir_utileria_jugador/' + jugadorId,
      fd,
      { headers }
    );
  }

  eliminar_archivo_utileria(
    jugadorId: any,
    archivoId: any,
    token: any
  ): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this._http.delete(
      this.url + 'eliminar_archivo_utileria/' + jugadorId + '/' + archivoId,
      {
        headers: headers,
      }
    );
  }

  subir_visorias_jugador(
    jugadorId: string,
    file: File,
    nombre: string,
    token: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: token,
    });

    const fd = new FormData();

    if (file.type === 'application/pdf') {
      fd.append('pdf', file);
    } else if (file.type.startsWith('video/')) {
      fd.append('video', file);
    } else {
      console.error('Tipo de archivo no permitido');
      return new Observable((observer) => {
        observer.error('Tipo de archivo no permitido');
      });
    }

    fd.append('nombre', nombre);

    return this._http.post(
      this.url + 'subir_visorias_jugador/' + jugadorId,
      fd,
      { headers }
    );
  }

  eliminar_archivo_visorias(
    jugadorId: any,
    archivoId: any,
    token: any
  ): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this._http.delete(
      this.url + 'eliminar_archivo_visorias/' + jugadorId + '/' + archivoId,
      {
        headers: headers,
      }
    );
  }

  listar_medicamentos(token: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });

    return this._http.get(this.url + 'listar_medicamentos', {
      headers: headers,
    });
  }

  registro_medicamento(data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });

    return this._http.post(this.url + 'registro_medicamento', data, {
      headers: headers,
    });
  }

  eliminar_medicamento(id: string, token: string): Observable<any> {
    let headers = new HttpHeaders({
      Authorization: token,
    });

    return this._http.delete(this.url + 'eliminar_medicamento/' + id, {
      headers,
    });
  }

  asignar_medicamento_a_jugador(
    jugador_id: string,
    data: { medicamento_id: string; cantidad: number; notas: string },
    token: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });

    const body = {
      jugador_id,
      ...data,
    };

    return this._http.post(this.url + 'asignar_medicamento_a_jugador', body, {
      headers: headers,
    });
  }

  eliminar_medicamento_asignado(
    jugadorId: string,
    areaMedicaId: string,
    token: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });

    return this._http.delete(
      `${this.url}eliminar_medicamento_asignado/${jugadorId}/${areaMedicaId}`,
      { headers: headers }
    );
  }

  registro_material(data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });

    return this._http.post(this.url + 'registro_material', data, {
      headers: headers,
    });
  }

  registro_prenda(data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });

    return this._http.post(this.url + 'registro_prenda', data, {
      headers: headers,
    });
  }

  listar_materiales(token: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });

    return this._http.get(this.url + 'listar_materiales', {
      headers: headers,
    });
  }

  listar_prendas(token: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });

    return this._http.get(this.url + 'listar_prendas', {
      headers: headers,
    });
  }

  eliminar_material(id: string, token: string): Observable<any> {
    let headers = new HttpHeaders({
      Authorization: token,
    });

    return this._http.delete(this.url + 'eliminar_material/' + id, {
      headers,
    });
  }

  eliminar_prenda(id: string, token: string): Observable<any> {
    let headers = new HttpHeaders({
      Authorization: token,
    });

    return this._http.delete(this.url + 'eliminar_prenda/' + id, {
      headers,
    });
  }

  asignar_material_a_jugador(
    jugador_id: string,
    data: { material_id: string; cantidad: number; notas: string },
    token: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });

    const body = {
      jugador_id,
      ...data,
    };

    return this._http.post(this.url + 'asignar_material_a_jugador', body, {
      headers: headers,
    });
  }

  asignar_prenda_a_jugador(
    jugador_id: string,
    data: { prenda_id: string; cantidad: number; notas: string },
    token: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });

    const body = {
      jugador_id,
      ...data,
    };

    return this._http.post(this.url + 'asignar_prenda_a_jugador', body, {
      headers: headers,
    });
  }

  eliminar_material_asignado(
    jugadorId: string,
    utileriaId: string,
    token: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });

    return this._http.delete(
      `${this.url}eliminar_material_asignado/${jugadorId}/${utileriaId}`,
      { headers: headers }
    );
  }

  eliminar_prenda_asignada(
    jugadorId: string,
    utileriaId: string,
    token: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });

    return this._http.delete(
      `${this.url}eliminar_prenda_asignada/${jugadorId}/${utileriaId}`,
      { headers: headers }
    );
  }
}
