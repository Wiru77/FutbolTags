import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';



@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.css'
})
export class TagsComponent {


@Output() public onNewTag: EventEmitter<any> = new EventEmitter();
@Output() public onNewPlayer: EventEmitter<any> = new EventEmitter();
@Output() public onNewPlayer2: EventEmitter<any> = new EventEmitter();

data: any[] = [];
public previousButton: any = null;
public previousButtonRight: any = null;
public previousButtonTag: any = null;
public editMode: boolean = false; 
public selectedPlayer:any = {};
public selectedPlayer2: any = {};
public selectedTag:any = {};
public tags:any[] = [

    { name: 'centro', label: 'CTRO' }, // 1 no es portería, 2 es portería
    { name: 'diagonal', label: 'DI' },
    { name: 'remate', label: 'RMT' },
    { name: 'uno vs uno ofensivo', label: '1vs1Of' },
    { name: 'tiro a gol', label: 'T-G' },
    { name: 'tiro con gol', label: 'T-C-G' },
    { name: 'tiro de esquina', label: 'T-E' },
    { name: 'tiro libre', label: 'T-L' },
    { name: 'pase de semivolea', label: 'PSV' },
    { name: 'fuera de lugar', label: 'F-L' },

    { name: 'parada', label: 'PRDA' }, // 1 no es portería, 2 es portería
    { name: 'gol', label: 'Gol' },
    { name: 'penal parado', label: 'P-PA' },
    { name: 'penal no parado', label: 'P-N-P' },
    { name: 'tiro fallado', label: 'T-F' },
    { name: 'pase raso con control', label: 'P-R-C' },
    { name: 'pase de primera', label: 'P-P' },
    { name: 'pase elevado', label: 'P-E' },
    { name: 'pase de profundidad', label: 'P-PR' },
    { name: 'pase raso control errado', label: 'P-R-C-E'},

    {name: 'pase de primera errado', label: 'P-P-E'}, // 1 no es portería, 2 es portería
    {name: 'pase elevado errado', label: 'P-E-E'},
    {name: 'pase de profundidad errado', label: 'P-PR-E'},
    {name: 'control raso errado', label: 'C-R-E'},
    {name: 'control media alto errado', label: 'C-MA-E'},
    {name: 'despeje', label: 'D'},
    {name: 'falta cometida', label: 'F-C'},
    {name: 'intercepcion', label: 'I'},
    {name: 'fildeo aereo ganado', label: 'F-A-G'},
    {name: 'enfrentamiento ganado', label: 'E-G'}
  
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

onFileChange(event: any) {
  const target: DataTransfer = <DataTransfer>(event.target);
  if (target.files.length !== 1) {
    throw new Error('Cannot use multiple files');
  }

  const reader: FileReader = new FileReader();
  reader.onload = (e: any) => {
    const binaryData: string = e.target.result;
    const workbook: XLSX.WorkBook = XLSX.read(binaryData, { type: 'binary' });

    const sheetName: string = workbook.SheetNames[0];
    const sheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

    // Convertir la hoja de cálculo a un array de objetos JSON
    let data = XLSX.utils.sheet_to_json(sheet);

    // Convertir las claves a minúsculas
    this.tags = data.map((row: any) => {
      const newRow: any = {};
      Object.keys(row).forEach(key => {
        newRow[key.toLowerCase()] = row[key];  // Convertir la clave a minúsculas
      });
      return newRow;
    });

    
  };

  reader.readAsBinaryString(target.files[0]);
}



tagSelect(event:any, tag:any){

  event.preventDefault();
  
  this.selectedTag = tag

  this.onNewTag.emit(this.selectedTag);

  let selectedButtonTag = document.getElementById(tag.label);

  if (this.previousButtonTag) {
    this.previousButtonTag.classList.remove("active_button_tag");
  }

  
  selectedButtonTag?.classList.add("active_button_tag");

  this.previousButtonTag = selectedButtonTag;

  
  
  
}

playerSelect(event: any, team: any, player: any) {
  event.preventDefault();
  
  this.selectedPlayer = {
    team : team.name,
    player : player 
  }
  this.onNewPlayer.emit(this.selectedPlayer);

  let selectedButton = document.getElementById(player.name);
  
      if (selectedButton?.classList.contains("active_button_right")) {
        selectedButton.classList.remove("active_button_right");
      }

      if (selectedButton?.classList.contains("active_button")) {

        selectedButton.classList.remove("active_button");
        this.previousButton = null;

      } else {
        
        if (this.previousButton) {
          this.previousButton.classList.remove("active_button");
        }

  selectedButton?.classList.add("active_button");

  this.previousButton = selectedButton;

  
  
}

}

playerSelect2(event: any, team: any, player: any) {
  event.preventDefault();
  
      this.selectedPlayer2 = {
        team: team.name,
        player: player
      };

      console.log(team , player);
      
  this.onNewPlayer2.emit(this.selectedPlayer2);

  let selectedButtonRight = document.getElementById(player.name);

          if (selectedButtonRight?.classList.contains("active_button")) {
            return;
          }

          if (selectedButtonRight?.classList.contains("active_button_right")) {

            selectedButtonRight.classList.remove("active_button_right");
            this.previousButtonRight = null;

          } else {
            
            if (this.previousButtonRight) {
              this.previousButtonRight.classList.remove("active_button_right");
            }

    selectedButtonRight?.classList.add("active_button_right");


    this.previousButtonRight = selectedButtonRight;
  }

  
  
}

  

toggleEditMode() {
    this.editMode = !this.editMode;

}

addTag() {
  this.tags.push({ name: 'Nuevo Tag', label: 'Nuevo', type: '1' });

}




  
} 
