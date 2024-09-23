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
      team : this.selectedPlayer1.team,
      player1: this.selectedPlayer1.player.name,
      player2: this.selectedPlayer2 ? this.selectedPlayer2.player.name : '',
      start: `${this.coordinates.startX} , ${this.coordinates.startY}`,
      end: `${this.coordinates.endX} , ${this.coordinates.endY}`
    }
    

    this.dataList.push(newData);

    console.log(this.dataList);
    
  }
}
