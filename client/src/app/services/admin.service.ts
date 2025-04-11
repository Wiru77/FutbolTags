import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GLOBAL } from './GLOBAL';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  public url;
  public id_usuario: any;

  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  login_admin(data: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'login_admin', data, {
      headers: headers,
    });
  }

  obtener_admin(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    return this._http.get(this.url + 'obtener_admin/' + id, {
      headers: headers,
    });
  }

  getToken() {
    return localStorage.getItem('token') || '';
  }

  setIdUsuario(id: any) {
    this.id_usuario = id;
    console.log(this.id_usuario);
  }

  getIdUsuario() {
    return this.id_usuario;
  }
}
