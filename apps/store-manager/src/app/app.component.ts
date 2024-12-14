import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TreeViewComponent } from './tree-view.component';

@Component({
  imports: [RouterModule, TreeViewComponent],
  selector: 'app-root',
  template: ` <app-tree-view></app-tree-view> `,
})
export class AppComponent {
  title = 'store-manager';
}
