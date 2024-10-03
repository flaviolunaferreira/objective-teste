import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BarraApresentacaoComponent } from "./components/barra-apresentacao/barra-apresentacao.component";
import { AreaDeTrabalhoComponent } from "./pages/area-de-trabalho/area-de-trabalho.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BarraApresentacaoComponent, AreaDeTrabalhoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Objective-teste';
}
