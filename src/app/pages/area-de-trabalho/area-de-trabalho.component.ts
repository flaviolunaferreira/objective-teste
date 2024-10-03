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
  styleUrl: './area-de-trabalho.component.scss',
  providers: [MarvelService]
})
export class AreaDeTrabalhoComponent {
  characters: any[] = [];
  searchTerm: string = '';
  currentPage: number = 0;
  itemsPerPage: number = 10;

  constructor(private marvelService: MarvelService) {}

  ngOnInit(): void {
    this.loadCharacters();
  }

  loadCharacters() {
    this.marvelService.getCharacters(this.currentPage * this.itemsPerPage).subscribe((data) => {
      console.log(data.data.results)
      this.characters = data.data.results;
    });
  }

  onSearch() {
    this.currentPage = 0; // Reset page when searching
    // Implement search logic here, filtering `this.characters` based on `this.searchTerm`
  }

  // Método para navegação entre páginas
  goToNextPage() {
    this.currentPage++;
    this.loadCharacters();
  }

  goToPreviousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadCharacters();
    }
  }
}
