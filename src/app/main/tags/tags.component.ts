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

public filterTagText: string = ''; 
public filteredTags: any[] = []; 
public filterPlayerText: string = '';  
public filteredTeam1: any[] = [];  
public filteredTeam2: any[] = []; 

public previousButton: any = null;
public previousButtonRight: any = null;
public previousButtonTag: any = null;
public editMode: boolean = false; 
public selectedPlayer:any = {};
public selectedPlayer2: any = {};
public selectedTag:any = {};
public tags:any[] = [

    { name: 'Centro', label: 'CTRO' }, // 1 no es portería, 2 es portería
    { name: 'Diagonal', label: 'DI' },
    { name: 'Remate', label: 'RMT' },
    { name: 'Uno vs uno ofensivo', label: '1vs1Of' },
    { name: 'Tiro a gol', label: 'T-G' },
    { name: 'Tiro con gol', label: 'T-C-G' },
    { name: 'Tiro de esquina', label: 'T-E' },
    { name: 'Tiro libre', label: 'T-L' },
    { name: 'Pase de semivolea', label: 'PSV' },
    { name: 'Fuera de lugar', label: 'F-L' },

    { name: 'Parada', label: 'PRDA' }, // 1 no es portería, 2 es portería
    { name: 'Gol', label: 'Gol' },
    { name: 'Penal parado', label: 'P-PA' },
    { name: 'Penal no parado', label: 'P-N-P' },
    { name: 'Tiro fallado', label: 'T-F' },
    { name: 'Pase raso con control', label: 'P-R-C' },
    { name: 'Pase de primera', label: 'P-P' },
    { name: 'Pase elevado', label: 'P-E' },
    { name: 'Pase de profundidad', label: 'P-PR' },
    { name: 'Pase raso control errado', label: 'P-R-C-E'},

    {name: 'Pase de primera errado', label: 'P-P-E'}, // 1 no es portería, 2 es portería
    {name: 'Pase elevado errado', label: 'P-E-E'},
    {name: 'Pase de profundidad errado', label: 'P-PR-E'},
    {name: 'Control raso errado', label: 'C-R-E'},
    {name: 'Control media alto errado', label: 'C-MA-E'},
    {name: 'Despeje', label: 'D'},
    {name: 'Falta cometida', label: 'F-C'},
    {name: 'Intercepcion', label: 'I'},
    {name: 'Fildeo aereo ganado', label: 'F-A-G'},
    {name: 'Enfrentamiento ganado', label: 'E-G'}
  
];

public team1:any = [{team:'Home'}]

public team2:any = [{team: 'Away'}]



constructor() {

  this.filteredTags = [...this.tags];
  this.filteredTeam1 = [...this.team1];
  this.filteredTeam2 = [...this.team2];

}

onTagsFileChange(event: any) {
  this.onFileChange(event).then((keys: any) => {
    this.tags = keys;
  }).catch((error: any) => {
    console.error('Error reading file', error);
  });
}

onTeam1FileChange(event: any) {
  this.onFileChange(event).then((keys: any) => {
    this.team1 = keys;
    this.filteredTeam1 = [...this.team1];
    console.log(this.team1);
    
  }).catch((error: any) => {
    console.error('Error reading file', error);
  });
}

onTeam2FileChange(event: any) {
  this.onFileChange(event).then((keys: any) => {
    this.team2 = keys;
    this.filteredTeam2 = [...this.team2];
  }).catch((error: any) => {
    console.error('Error reading file', error);
  });
}

onFileChange(event: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) {
      return reject('Cannot use multiple files');
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
      const keys = data.map((row: any) => {
        const newRow: any = {};
        Object.keys(row).forEach(key => {
          newRow[key.toLowerCase()] = row[key];  // Convertir la clave a minúsculas
        });
        return newRow;
      });

      resolve(keys);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsBinaryString(target.files[0]);
  });
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

  this.filterTagText = '';
  this.filteredTags = [...this.tags];
  
}


filterTags() {
  const filterTextLower = this.filterTagText.toLowerCase();

  
  this.filteredTags = this.tags.filter(tag =>
    tag.name.toLowerCase().includes(filterTextLower)
  );
}


playerSelect(event: any, team: any, player: any , i: any) {
  console.log(team);
  
  event.preventDefault();
  
  let selectedButton = document.getElementById(team + i);

  if (selectedButton?.classList.contains("active_button_right")) {
    selectedButton.classList.remove("active_button_right");

    this.selectedPlayer2 = {
      team: "",
      player: ""  
    };
    this.onNewPlayer2.emit(this.selectedPlayer2); 
  }

  if (selectedButton?.classList.contains("active_button")) {
    selectedButton.classList.remove("active_button");

    this.selectedPlayer = {
      team: "",
      player: ""
    };
    this.onNewPlayer.emit(this.selectedPlayer); 

    this.previousButton = null;
  } else {
    
    if (this.previousButton) {
      this.previousButton.classList.remove("active_button");
    }

    selectedButton?.classList.add("active_button");

    this.selectedPlayer = {
      team: team,
      player: player
    };
    this.onNewPlayer.emit(this.selectedPlayer);

    this.previousButton = selectedButton;
  }

  this.filterPlayerText = '';  
  this.filteredTeam1 = [...this.team1];  
  this.filteredTeam2 = [...this.team2]; 
}


playerSelect2(event: any, team: any, player: any , i :any) {
  event.preventDefault();
  
  let selectedButtonRight = document.getElementById(team + i);

  if (selectedButtonRight?.classList.contains("active_button")) {
    return; 
  }

  if (selectedButtonRight?.classList.contains("active_button_right")) {
    selectedButtonRight.classList.remove("active_button_right");
    
    this.selectedPlayer2 = {
      team: "",
      player: ""
    };
    this.onNewPlayer2.emit(this.selectedPlayer2);

    this.previousButtonRight = null;
  } else {
    
    if (this.previousButtonRight) {
      this.previousButtonRight.classList.remove("active_button_right");
    }

   
    selectedButtonRight?.classList.add("active_button_right");

  
    this.selectedPlayer2 = {
      team: team,
      player: player
    };

    this.onNewPlayer2.emit(this.selectedPlayer2);

    this.previousButtonRight = selectedButtonRight;
  }

  this.filterPlayerText = '';  
  this.filteredTeam1 = [...this.team1];  
  this.filteredTeam2 = [...this.team2]; 
}


filterPlayers() {
  const filterTextLower = this.filterPlayerText.toLowerCase();

  
  this.filteredTeam1 = this.team1.filter((player: { lastname: string })=>
    player.lastname.toLowerCase().includes(filterTextLower)
  );

  
  this.filteredTeam2 = this.team2.filter((player: { lastname: string }) =>
    player.lastname.toLowerCase().includes(filterTextLower)
  );
}



toggleEditMode() {
    this.editMode = !this.editMode;

}

addTag() {
  this.tags.push({ name: 'Nuevo Tag', label: 'Nuevo', type: '1' });

}



  
} 
