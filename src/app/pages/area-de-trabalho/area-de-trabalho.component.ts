import { Component } from '@angular/core';
import { MarvelService } from '../../services/marvel.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Character, MarvelApiResponse } from '../../models/marvel.types';
import { forkJoin, Observable } from 'rxjs';

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
  result: Character[] = [];
  searchTerm: string = '';
  currentPage: number = 0;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  sortColumn: string = 'name';
  sortDirection: string = 'asc';
  itemsPerPageOptions: number[] = [10, 20, 50];
  isLoading: boolean = false;

  constructor(private marvelService: MarvelService) {}

  ngOnInit(): void {
    this.loadCharacters();
  }

  loadCharacters() {
    const offset = this.currentPage * this.itemsPerPage;
    const apiLimit = 20; // Limite que a API retorna por padrão
    if (this.itemsPerPage <= apiLimit) {
      // Apenas uma requisição quando o limite for menor ou igual ao limite da API
      this.marvelService.getCharacters(offset, apiLimit)
        .subscribe((data: MarvelApiResponse) => {
          this.result = data.data.results;
          this.totalPages = Math.ceil(data.data.total / this.itemsPerPage);
          this.result.forEach(element => {
            if (this.characters.length < this.itemsPerPage ) {
              this.characters.push(element)
            }
          });
          this.isLoading = false;
        }, (error) => {
          this.isLoading = false;
        });
    } else {
      // Múltiplas requisições para grandes números de itens por página
      const requestsNeeded = Math.ceil(this.itemsPerPage / apiLimit);
      const requests: Observable<MarvelApiResponse>[] = [];

      for (let i = 0; i < requestsNeeded; i++) {
        const additionalOffset = offset + (i * apiLimit);
        requests.push(this.marvelService.getCharacters(additionalOffset, apiLimit));
      }

      forkJoin(requests).subscribe((responses: MarvelApiResponse[]) => {
        let allResults: Character[] = [];
        responses.forEach((response: MarvelApiResponse) => {
          allResults = [...allResults, ...response.data.results];
        });

        this.characters = allResults.slice(0, this.itemsPerPage);
        this.totalPages = Math.ceil(allResults.length / this.itemsPerPage);
        this.isLoading = false;
      }, (error) => {
        this.isLoading = false;
      });
    }
  }

  changeItemsPerPage(event: any) {
    this.itemsPerPage = +event.target.value;
    this.currentPage = 0;
    this.isLoading = true;
    this.loadCharacters();
  }

  goToNextPage() {
    this.isLoading = true;
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadCharacters();
    }
  }

  goToPreviousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadCharacters();
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
    this.filteredCharacters = this.characters.filter(character =>
      character.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.currentPage = 0;
  }
}
