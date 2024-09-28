import { Component } from '@angular/core';
import { FieldComponent } from './field/field.component';
import { GoalComponent } from './goal/goal.component';
import { TableComponent } from './table/table.component';
import { TagsComponent } from './tags/tags.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [FieldComponent , GoalComponent, TableComponent, TagsComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  dataList: any[] = [];
  selectedPlayer1 = {
    team: 'Team 1',
    player: {name:'A1', position:'DEL', number:'10'}
  }
  selectedPlayer2 = {
    team: '',
    player: {name:'', position:'', number:''}
  }
  selectedTag = '';
  coordinates = {
    startX: '-',
    startY: '-',
    endX: '-',
    endY: '-'
  }

  time = '';

  onNewTag(tag:any):void{
    this.selectedTag = tag.name;
    
  }

  onCoordinatesReceived(event: { startX: number, startY: number, endX?: number, endY?: number }) {
    this.coordinates = {
      startX: event.startX.toString(),
      startY: event.startY.toString(),
      endX: event.endX !== undefined ? event.endX.toString() : '-',
      endY: event.endY !== undefined ? event.endY.toString() : '-'
    };
  
    this.submitTag();
  }

  submitTag(){
    let newData = {
      tag : this.selectedTag,
      player1: this.selectedPlayer1,
      player2: this.selectedPlayer2,
      start: `${this.coordinates.startX} , ${this.coordinates.startY}`,
      end: `${this.coordinates.endX} , ${this.coordinates.endY}`,
      time: this.time
    }
    this.dataList.push(newData);
  }

  onNewPlayer(player:any):void{
    this.selectedPlayer1 = player;
    console.log(player);
    
    
  }

  onNewPlayer2(player:any):void{
    this.selectedPlayer2 = player;
    console.log(player);
    
    
  }

  timeChange(event: any){
    this.time = this.convertToTimeFormat(event.target.value)
    
  }

   convertToTimeFormat(input: number): string {
    // Convertir el número a una cadena
    let inputString = input.toString();
    
    // Si tiene un dígito, es la hora y los minutos serán 00 (01:00, 02:00, etc.)
    if (inputString.length === 1) {
      return `0${inputString}:00`;
    }
    
    // Si tiene dos dígitos, son las horas (XX:00)
    if (inputString.length === 2) {
      return `${inputString.padStart(2, '0')}:00`;
    }
    
    // Si tiene tres dígitos, los primeros dos son las horas y el último los minutos (XX:0X)
    if (inputString.length === 3) {
      const hours = inputString.slice(0, 2);
      const minutes = inputString.slice(2).padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    
    // Si tiene cuatro o más dígitos, los últimos dos son los minutos y el resto las horas (XXXX:XX)
    if (inputString.length >= 4) {
      const minutes = inputString.slice(-2);
      const hours = inputString.slice(0, -2).padStart(2, '0');
      return `${hours}:${minutes}`;
    }
  
    // Devolver un valor por defecto si ocurre algo inesperado
    return '00:00';
  }
  
}
