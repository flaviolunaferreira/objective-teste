import { Component } from '@angular/core';
import { MarvelService } from '../../services/marvel.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-area-de-trabalho',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './area-de-trabalho.component.html',
  styleUrls: ['./area-de-trabalho.component.scss'],
  providers: [MarvelService]
})
export class AreaDeTrabalhoComponent {
  characters: any[] = [];
  searchTerm: string = '';
  currentPage: number = 0;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  sortColumn: string = 'name';
  sortDirection: string = 'asc';
  itemsPerPageOptions: number[] = [5, 10, 20];

  constructor(private marvelService: MarvelService) {}

  ngOnInit(): void {
    this.loadCharacters();
  }

  loadCharacters() {
    this.marvelService.getCharacters(this.currentPage * this.itemsPerPage, this.itemsPerPage)
      .subscribe((data) => {
        this.characters = data.data.results;
        // A API provavelmente retorna um campo `total` com a contagem total de registros
        this.totalPages = Math.ceil(data.data.total / this.itemsPerPage);
      });
  }


  changeItemsPerPage(event: any) {
    this.itemsPerPage = +event.target.value;
    this.currentPage = 0;
    this.loadCharacters();
  }

  goToNextPage() {
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

  sortTable(column: string) {
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
    this.currentPage = 0;
  }
}
