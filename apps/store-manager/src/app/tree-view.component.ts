import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { CategoryService } from './category.service';
import { NgClass, NgTemplateOutlet, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-tree-view',
  template: `
    <ng-template let-category #categoryNode>
      <div class="font-inter p-2">
        <div class="cursor-pointer flex gap-4 items-center">
          <div
            class="select-none"
            (click)="
              toggleCategory(category, categoryNode.elementRef.nativeElement);
              $event.stopPropagation()
            "
          >
            @if (category.children.length == 0) { 📦 } @else if
            (categoryNode.elementRef.nativeElement.state?.[category.id] ==
            false) { ➕ } @else { ➖ }
          </div>
          <div class="font-semibold">
            {{ category.name | titlecase }}
          </div>
          <div class="btn text-sm p-1 border border-gray-400 rounded-lg">
            ✏️ Edit
          </div>
        </div>
        <ul
          class="list-none ml-4 border-l border-gray-300 pl-4 space-y-2"
          [ngClass]="{ hidden: categoryNode.elementRef.nativeElement.state?.[category.id] == false }"
        >
          @for (categoryItem of category.children; track categoryItem.id) {
          <li class="">
            <ng-container
              *ngTemplateOutlet="
                categoryNode;
                context: { $implicit: categoryItem }
              "
            ></ng-container>
          </li>
          }
        </ul>
      </div>
    </ng-template>

    <ng-container
      *ngTemplateOutlet="categoryNode; context: { $implicit: categoryTree() }"
    ></ng-container>
  `,
  imports: [NgTemplateOutlet, TitleCasePipe, NgClass],
})
export class TreeViewComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  categoryTree = signal<any>(undefined);
  defaultState = signal<'open' | 'close'>('open');

  ngOnInit() {
    this.categoryService.fetchCategories().subscribe((categories) => {
      console.log(categories);
      this.categoryTree.set(categories);
    });
  }

  toggleCategory(category: any, element: any) {
    if (!category.id) {
      category.id = 'root';
    }
    if (element.state == undefined) {
      element.state = {};
    }
    if (element.state[category.id] == undefined) {
      if (this.defaultState() == 'open') {
        element.state[category.id] = true;
      } else {
        element.state[category.id] = true;
      }
    }
    console.log(category.name, category.id);
    console.log(element.state);
    element.state[category.id] = !element.state[category.id];
  }
}
