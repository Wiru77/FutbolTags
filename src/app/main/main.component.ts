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
  

  onNewTag(tag:any):void{
    console.log(tag);
    
  }

  onNewPlayer(player:any):void{
    console.log(player);
    
  }

  onNewPlayer2(player:any):void{
    console.log(player);
    
  }
}
