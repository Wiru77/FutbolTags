import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GLOBAL } from './GLOBAL';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  public url;

  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  listar_stats_filtro_admin(token: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token, // Enviar token
    });

    return this._http.get(this.url + 'listar_stats_filtro_admin', {
      headers: headers,
    });
  }
}
