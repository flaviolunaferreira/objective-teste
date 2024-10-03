import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

Injectable({
  providedIn: 'root'
})

const CryptoJS = require('crypto-js');


export class MarvelService {

  private publicKey = 'e38a15039e73be02e0cf10ded65d67dd';
  private privateKey = 'fe5c0ae1a3056de1c9a067ea29e57adcb1896246';
  private baseUrl = 'https://gateway.marvel.com/v1/public/characters';

  constructor(private http: HttpClient) {};

  getCharacters(name?: string, page: number = 1): Observable<any> {
    let ts = new Date().getTime();
    let hash = CryptoJS(ts + this.privateKey + this.publicKey).toString();
    const offset = (page - 1) * 10; // 10 personagens por página
    let url = `${this.baseUrl}?ts=${ts}&apikey=${this.publicKey}&hash=${hash}&limit=10&offset=${offset}`;

    if (name) {
      url += `&nameStartsWith=${name}`;
    }

    return this.http.get(url);
  }

}
