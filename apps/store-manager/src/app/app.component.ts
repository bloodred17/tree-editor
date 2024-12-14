import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TreeViewComponent } from './tree-view.component';

@Component({
  imports: [RouterModule, TreeViewComponent],
  selector: 'app-root',
  template: `
    <div class="p-4 font-inter space-y-4">
      <div class="flex items-center justify-center">
        <h1 class="font-semibold text-4xl">TreeView: Category Manager</h1>
      </div>
      <div
        class="border shadow-md rounded-lg p-4 bg-white space-y-2 cursor-help"
      >
        <h3 class="text-2xl font-bold">How does it work?</h3>
        <p class="text-lg">
          This is a simple tree view component that allows you to manage
          categories. You can add, edit, and delete categories.
        </p>
        <div class="flex flex-wrap gap-2 items-center">
          <div class="btn text-sm p-1 border border-gray-400 rounded-lg">
            🆕 Add
          </div>
          <p>Adds a new child category and names it "New" by default.</p>
        </div>
        <div class="flex gap-2 items-center">
          <div class="btn text-sm p-1 border border-gray-400 rounded-lg">
            ✏️ Edit
          </div>
          <p>Edits the name of the category.</p>
        </div>
        <div class="flex gap-2 items-center">
          <div class="btn text-sm p-1 border border-gray-400 rounded-lg">
            🗑️ Delete
          </div>
          <p>Deletes the category.</p>
        </div>
        <p class="text-red-600 text-sm">
          <span class="text-red-700 underline">Note:</span> A new category will
          not be created if an existing node named "New" exists in sibling.
          Duplicates are not supported.
        </p>
      </div>
      <div>
        <app-tree-view></app-tree-view>
      </div>
    </div>
  `,
})
export class AppComponent {
  title = 'store-manager';
}
