import { Component, inject, OnInit, signal } from '@angular/core';
import { CategoryService } from './category.service';
import { NgClass, NgTemplateOutlet, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tree-view',
  template: `
    <ng-template let-category let-parent="parent" #categoryNode>
      @let state = categoryNode.elementRef.nativeElement.state;
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
              addCategory(category, categoryNode.elementRef.nativeElement)
            "
          >
            🆕 Add
          </div>
          <div
            class="btn text-sm p-1 border border-gray-400 rounded-lg"
            (click)="
              editCategory(category, categoryNode.elementRef.nativeElement)
            "
          >
            ✏️ Edit
          </div>
          }
          <div
            class="btn text-sm p-1 border border-gray-400 rounded-lg"
            (click)="
              deleteCategory(category, categoryNode.elementRef.nativeElement)
            "
          >
            🗑️ Delete
          </div>
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
                context: { $implicit: categoryItem, parent: category.id }
              "
            ></ng-container>
          </li>
          }
        </ul>
      </div>
      @if (state?.[category.id] && state?.[category.id].add == true) {
      <div class="font-inter p-2">
        @let _category = { name: 'new', parent: parent, children: [], id: 'new'
        };
        <div class="cursor-pointer flex gap-4 items-center">
          <div
            class="select-none"
            (click)="
              toggleCategory(_category, categoryNode.elementRef.nativeElement);
              $event.stopPropagation()
            "
          >
            @if (_category.children.length == 0) { 📦 } @else if
            (state?.[_category.id] && state?.[_category.id]?.display == false) {
            ➕ } @else { ➖ }
          </div>
          <div class="font-semibold">
            @if (state?.[_category.id] && state?.[_category.id].edit == true) {
            <input
              class="border border-gray-400 rounded-lg p-1"
              type="text"
              [(ngModel)]="_category.name"
            />
            } @else {
            {{ _category.name | titlecase }}
            }
          </div>
          @if (state?.[_category.id] && state?.[_category.id].edit == true) {
          <div
            class="btn text-sm p-1 border border-gray-400 rounded-lg"
            (click)="saveEdit(_category, categoryNode.elementRef.nativeElement)"
          >
            📩 Save
          </div>
          <div
            class="btn text-sm p-1 border border-gray-400 rounded-lg"
            (click)="
              cancelEdit(_category, categoryNode.elementRef.nativeElement)
            "
          >
            ✖️ Cancel
          </div>
          } @else {
          <div
            class="btn text-sm p-1 border border-gray-400 rounded-lg"
            (click)="
              editCategory(_category, categoryNode.elementRef.nativeElement)
            "
          >
            ✏️ Edit
          </div>
          }
        </div>
      </div>
      }
    </ng-template>

    <ng-container
      *ngTemplateOutlet="
        categoryNode;
        context: { $implicit: categoryTree(), parent: 'root' }
      "
    ></ng-container>
  `,
  imports: [NgTemplateOutlet, TitleCasePipe, NgClass, FormsModule],
})
export class TreeViewComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  categoryTree = signal<any>(undefined);
  defaultState = signal<'open' | 'close'>('open');
  creationMode = signal<'add' | 'edit'>('edit');

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
        add: false,
      };
    }
    // console.log(category.id, element.state[category.id]);
  }

  toggleCategory(category: any, element: any) {
    this.initCategoryState(category, element);
    element.state[category.id].display = !element.state[category.id].display;
  }

  editCategory(category: any, element: any) {
    this.creationMode.set('edit');
    this.initCategoryState(category, element);
    element.state[category.id].edit = true;
    console.log(category.id);
  }

  cancelEdit(category: any, element: any) {
    this.initCategoryState(category, element);
    element.state[category.id].edit = false;
  }

  saveEdit(category: any, element: any) {
    console.log(category);
    this.initCategoryState(category, element);
    element.state[category.id].edit = false;
    if (this.creationMode() == 'add') {
      this.categoryService
        .createCategory(category.name, category.parent)
        .subscribe(this.setCategoryTree());
    } else {
      this.categoryService
        .updateCategory(category.id, category.name)
        .subscribe(this.setCategoryTree());
    }
  }

  deleteCategory(category: any, element: any) {
    this.initCategoryState(category, element);
    this.categoryService
      .deleteCategory(category.id)
      .subscribe(this.setCategoryTree());
  }

  addCategory(category: any, element: any) {
    this.creationMode.set('add');
    this.initCategoryState(category, element);
    element.state[category.id].add = true;
    element.state['new'] = { edit: true, display: true };
    console.log(this.creationMode());
  }
}
