import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaDeTrabalhoComponent } from './area-de-trabalho.component';
import { MarvelService } from '../../services/marvel.service';
import { of, throwError } from 'rxjs';

class MockMarvelService {
  getCharacters() {
    return of({ data: { results: [] } }); // Mock da resposta
  }
}

describe('AreaDeTrabalhoComponent', () => {
  let component: AreaDeTrabalhoComponent;
  let fixture: ComponentFixture<AreaDeTrabalhoComponent>;
  let marvelService: MarvelService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AreaDeTrabalhoComponent],
      providers: [
        { provide: MarvelService, useClass: MockMarvelService } // Usando o mock
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaDeTrabalhoComponent);
    component = fixture.componentInstance;
    marvelService = TestBed.inject(MarvelService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter characters based on search term', () => {
    component.searchTerm = 'Spider-Man';
    component.onSearch();
    expect(component.filteredCharacters.length).toBe(1);
    expect(component.filteredCharacters[0].name).toBe('Spider-Man');
  });

  it('should navigate to the next page', () => {
    component.currentPage = 0;
    component.goToNextPage();
    expect(component.currentPage).toBe(1);
  });

  it('should navigate to the previous page', () => {
    component.currentPage = 1;
    component.goToPreviousPage();
    expect(component.currentPage).toBe(0);
  });

  it('should show loading spinner when changing items per page', () => {
    component.changeItemsPerPage({ target: { value: 10 } });
    expect(component.isLoading).toBeTrue();
  });

  it('should display characters when API call is successful', () => {
    spyOn(marvelService, 'getCharacters').and.returnValue(of(MockMarvelService));
    component.loadCharacters();
    expect(component.characters.length).toBe(MockMarvelService.length);
  });

  it('should handle error when API call fails', () => {
    spyOn(marvelService, 'getCharacters').and.returnValue(throwError('Error'));
    component.loadCharacters();
    expect(component.isLoading).toBeFalse();
  });
});
