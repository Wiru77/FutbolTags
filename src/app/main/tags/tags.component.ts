import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.css'
})
export class TagsComponent {


@Output()
public onNewTag: EventEmitter<any> = new EventEmitter();


public editMode: boolean = false; 
public selectedPlayer:any = {};
public selectedPlayer2: any = {};
public selectedTag:any = {};
public tags:any[] = [

    { name: 'centro', label: 'CTRO', type: '1' }, // 1 no es portería, 2 es portería
    { name: 'diagonal', label: 'DI', type: '1' },
    { name: 'remate', label: 'RMT', type: '1' },
    { name: 'uno vs uno ofensivo', label: '1vs1Of', type: '1' },
    { name: 'tiro a gol', label: 'T-G', type: '2' },
    { name: 'tiro con gol', label: 'T-C-G', type: '2' },
    { name: 'tiro de esquina', label: 'T-E', type: '1' },
    { name: 'tiro libre', label: 'T-L', type: '1' },
    { name: 'pase de semivolea', label: 'PSV', type: '1' },
    { name: 'fuera de lugar', label: 'F-L', type: '1' },

    { name: 'parada', label: 'PRDA', type: '2' }, // 1 no es portería, 2 es portería
    { name: 'gol', label: 'Gol', type: '2' },
    { name: 'penal parado', label: 'P-PA', type: '2' },
    { name: 'penal no parado', label: 'P-N-P', type: '2' },
    { name: 'tiro fallado', label: 'T-F', type: '1' },
    { name: 'pase raso con control', label: 'P-R-C', type: '1' },
    { name: 'pase de primera', label: 'P-P', type: '1' },
    { name: 'pase elevado', label: 'P-E', type: '1' },
    { name: 'pase de profundidad', label: 'P-PR', type: '1' },
    { name: 'pase raso control errado', label: 'P-R-C-E', type: '1'},

    {name: 'pase de primera errado', label: 'P-P-E', type: '1'}, // 1 no es portería, 2 es portería
    {name: 'pase elevado errado', label: 'P-E-E', type: '1'},
    {name: 'pase de profundidad errado', label: 'P-PR-E', type: '1'},
    {name: 'control raso errado', label: 'C-R-E', type: '1'},
    {name: 'control media alto errado', label: 'C-MA-E', type: '1'},
    {name: 'despeje', label: 'D', type: '1'},
    {name: 'falta cometida', label: 'F-C', type: '1'},
    {name: 'intercepcion', label: 'I', type: '1'},
    {name: 'fildeo aereo ganado', label: 'F-A-G', type: '1'},
    {name: 'enfrentamiento ganado', label: 'E-G', type: '1'}
  
];

public teams:any[] = [

    { 
      name:'Home', 
      players:[
    {name:'H1', posicion:'', number:'1'},
    {name:'H2', posicion:'', number:'1'},
    {name:'H3', posicion:'', number:'1'},
    {name:'H4', posicion:'', number:'1'},
    {name:'H5', posicion:'', number:'1'},
    {name:'H6', posicion:'', number:'1'},
    {name:'H7', posicion:'', number:'1'},
    {name:'H8', posicion:'', number:'1'},
    {name:'H9', posicion:'', number:'1'},
    {name:'H10', posicion:'', number:''},
    {name:'H11', posicion:'', number:''},
      ]
    },
    { 
      name:'Away', 
      players:[
    {name:'A1', position:'', number:''},
    {name:'A2', position:'', number:''},
    {name:'A3', position:'', number:''},
    {name:'A4', position:'', number:''},
    {name:'A5', position:'', number:''},
    {name:'A6', position:'', number:''},
    {name:'A7', position:'', number:''},
    {name:'A8', position:'', number:''},
    {name:'A9', position:'', number:''},
    {name:'A10', position:'', number:''},
    {name:'A11', position:'', number:''},
      ]
    },
  

];



tagSelect(tag:any){
  this.selectedTag = tag
  this.onNewTag.emit(this.selectedTag);
  console.log(this.selectedTag);
}

playerSelect(event:any, team:any, player:any){

  event.preventDefault()
  this.selectedPlayer = {
    team : team,
    player : player 
  }
 
  console.log(this.selectedPlayer);
  console.log(event);
  
  
}

toggleEditMode() {
  this.editMode = !this.editMode;
 // if (!this.editMode) {
    // Aquí puedes guardar los cambios cuando el modo edición se desactiva
    //console.log('Teams guardados:', this.teams);
   //console.log('Tags guardados:', this.tags);
  //}
}

addTag() {
  // Lógica para agregar un nuevo tag
  this.tags.push({ name: 'Nuevo Tag', label: 'Nuevo', type: '1' });
}

onRightClick(event: MouseEvent): void {
  event.preventDefault(); 

  console.log(event);
  

}



  
} 
