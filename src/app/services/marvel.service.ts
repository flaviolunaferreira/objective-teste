import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class MarvelService {
  private publicKey = 'e38a15039e73be02e0cf10ded65d67dd';
  private privateKey = 'fe5c0ae1a3056de1c9a067ea29e57adcb1896246';
  private baseUrl = 'https://gateway.marvel.com/v1/public/characters';

  constructor(private http: HttpClient) {}

  getCharacters(offset: number = 0, itemsPerPage?: number): Observable<any> {
    const ts = new Date().getTime();
    const hash = CryptoJS.MD5(ts + this.privateKey + this.publicKey).toString();
    const url = `${this.baseUrl}?ts=${ts}&apikey=${this.publicKey}&hash=${hash}&offset=${offset}`;
    return this.http.get<any>(url);
  }
}
