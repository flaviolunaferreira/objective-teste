import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarraApresentacaoComponent } from './barra-apresentacao.component';

describe('BarraApresentacaoComponent', () => {
  let component: BarraApresentacaoComponent;
  let fixture: ComponentFixture<BarraApresentacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarraApresentacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarraApresentacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
