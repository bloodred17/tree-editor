import { Component, inject, OnInit, signal } from '@angular/core';
import { CategoryService } from './category.service';
import { NgClass, NgTemplateOutlet, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tree-view',
  template: `
    <ng-template let-category #categoryNode>
      <div class="font-inter p-2">
        @let state = categoryNode.elementRef.nativeElement.state;
        <div class="cursor-pointer flex gap-4 items-center">
          <div
            class="select-none"
            (click)="
              toggleCategory(category, categoryNode.elementRef.nativeElement);
              $event.stopPropagation()
            "
          >
            @if (category.children.length == 0) { 📦 } @else if
            (state?.[category.id] && state?.[category.id]?.display == false) {
            ➕ } @else { ➖ }
          </div>
          <div class="font-semibold">
            @if (state?.[category.id] && state?.[category.id].edit == true) {
            <input
              class="border border-gray-400 rounded-lg p-1"
              type="text"
              [(ngModel)]="category.name"
            />
            } @else {
            {{ category.name | titlecase }}
            }
          </div>
          @if (state?.[category.id] && state?.[category.id].edit == true) {
          <div
            class="btn text-sm p-1 border border-gray-400 rounded-lg"
            (click)="saveEdit(category, categoryNode.elementRef.nativeElement)"
          >
            📩 Save
          </div>
          <div
            class="btn text-sm p-1 border border-gray-400 rounded-lg"
            (click)="
              cancelEdit(category, categoryNode.elementRef.nativeElement)
            "
          >
            ✖️ Cancel
          </div>
          } @else {
          <div
            class="btn text-sm p-1 border border-gray-400 rounded-lg"
            (click)="
              editCategory(category, categoryNode.elementRef.nativeElement)
            "
          >
            ✏️ Edit
          </div>
          }
        </div>
        <ul
          class="list-none ml-4 border-l border-gray-300 pl-4 space-y-2"
          [ngClass]="{ hidden: state?.[category.id] && state?.[category.id].display == false }"
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
  imports: [NgTemplateOutlet, TitleCasePipe, NgClass, FormsModule],
})
export class TreeViewComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  categoryTree = signal<any>(undefined);
  defaultState = signal<'open' | 'close'>('open');

  setCategoryTree = () => (categories: any) => {
    console.log(categories);
    this.categoryTree.set(categories);
  };

  ngOnInit() {
    this.categoryService.fetchCategories().subscribe(this.setCategoryTree());
  }

  initCategoryState(category: any, element: any) {
    if (!category.id) {
      category.id = 'root';
    }
    if (element.state == undefined) {
      element.state = {};
    }
    if (element.state[category.id] == undefined) {
      element.state[category.id] = {
        display: this.defaultState() == 'open',
        edit: false,
      };
    }
    // console.log(category.id, element.state[category.id]);
  }

  toggleCategory(category: any, element: any) {
    this.initCategoryState(category, element);
    element.state[category.id].display = !element.state[category.id].display;
  }

  editCategory(category: any, element: any) {
    this.initCategoryState(category, element);
    element.state[category.id].edit = true;
  }

  cancelEdit(category: any, element: any) {
    this.initCategoryState(category, element);
    element.state[category.id].edit = false;
  }

  saveEdit(category: any, element: any) {
    this.initCategoryState(category, element);
    element.state[category.id].edit = false;
    this.categoryService
      .updateCategory(category.id, category.name)
      .subscribe(this.setCategoryTree());
  }
}
