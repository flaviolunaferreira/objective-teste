import { Component } from '@angular/core';
import { MarvelService } from '../../services/marvel.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Character, MarvelApiResponse } from '../../models/marvel.types';
import { forkJoin, Observable } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';



@Component({
  selector: 'app-area-de-trabalho',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './area-de-trabalho.component.html',
  styleUrls: ['./area-de-trabalho.component.scss'],
  providers: [MarvelService]
})
export class AreaDeTrabalhoComponent {
  characters: Character[] = [];  // Tipagem para personagens
  filteredCharacters: Character[] = [];

  searchTerm: string = '';
  currentPage: number = 0;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  sortColumn: string = 'name';
  sortDirection: string = 'asc';
  itemsPerPageOptions: number[] = [10, 20, 50];
  isLoading: boolean = false;
  allCharactersLoaded: boolean = false;
  maxVisiblePages: number = 5;
  loadProgress: number = 0;

  constructor(private marvelService: MarvelService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadCharacters();

  }

  // Função para carregar todos os personagens da API e armazená-los localmente
  loadCharacters() {
    this.isLoading = true;
    const apiLimit = 20; // Quantidade máxima que a API permite
    let totalCharacters = 0;

    // Primeiro, obter o total de personagens da Marvel API
    this.marvelService.getCharacters(0, apiLimit).subscribe((data: MarvelApiResponse) => {
      totalCharacters = data.data.total;  // Pega o número total de personagens
      const requestsNeeded = Math.ceil(totalCharacters / apiLimit);

      // Requisições sendo processadas uma por vez
      let loadedCharacters = 0;
      let requestsCompleted = 0;

      for (let i = 0; i < requestsNeeded; i++) {
        const offset = i * apiLimit;

        // Faz uma requisição por vez e atualiza o progresso
        this.marvelService.getCharacters(offset, apiLimit).subscribe((response: MarvelApiResponse) => {
          this.characters.push(...response.data.results);  // Armazena personagens
          loadedCharacters += response.data.results.length;
          requestsCompleted++;

          // Atualiza o progresso de acordo com as requisições completas
          this.loadProgress = Math.floor((loadedCharacters / totalCharacters) * 100);
          this.cdr.detectChanges();  // Força a atualização do progresso no template
          console.log(`Progresso: ${this.loadProgress}%`);

          // Quando todas as requisições estiverem completas
          if (requestsCompleted === requestsNeeded) {
            this.totalPages = Math.ceil(this.characters.length / this.itemsPerPage); // Atualiza as páginas
            this.getCharactersForCurrentPage();  // Filtra a primeira página
            this.isLoading = false;  // Termina o carregamento
            this.allCharactersLoaded = true;
          }
        });
      }
    });
  }


  getCharactersForCurrentPage() {
    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredCharacters = this.characters.slice(startIndex, endIndex);
  }

  changeItemsPerPage(event: any) {
    this.isLoading = true;
    this.itemsPerPage = +event.target.value;
    this.currentPage = 0;
    this.totalPages = Math.ceil(this.characters.length / this.itemsPerPage)
    this.getCharactersForCurrentPage();
    this.isLoading = false;
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.getCharactersForCurrentPage();
      this.currentPage++;
    }
  }

  goToPreviousPage() {
    if (this.currentPage > 0) {
      this.getCharactersForCurrentPage();
      this.currentPage--;
    }
  }

  sortTable(column: keyof Character) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.characters.sort((a, b) => {
      let comparison = 0;
      if (a[column] > b[column]) {
        comparison = 1;
      } else if (a[column] < b[column]) {
        comparison = -1;
      }
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  onSearch() {
    if (this.searchTerm) {
      this.filteredCharacters = this.characters.filter(character =>
        character.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredCharacters = this.characters;
    }
    this.totalPages = Math.ceil(this.characters.length / this.itemsPerPage)
    this.currentPage = 0; // Reseta a página para 0
  }

  getPageRange(): number[] {
    const start = Math.max(0, this.currentPage - Math.floor(this.maxVisiblePages / 2));
    const end = Math.min(this.totalPages, start + this.maxVisiblePages);
    let range = [];

    for (let i = start; i < end; i++) {
      range.push(i);
    }

    return range;
  }

  // Função para ir para uma página específica
  goToPage(page: number): void {
    this.currentPage = page;
    this.getCharactersForCurrentPage();
  }

}
