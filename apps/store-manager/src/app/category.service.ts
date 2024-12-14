import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, switchMap } from 'rxjs';

export interface ShopResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly http = inject(HttpClient);

  fetchCategories() {
    return this.http
      .get<ShopResponse<any>>('http://localhost:3333/api/category')
      .pipe(map((response) => response.data));
  }

  createCategory(name: string, parent: string) {
    console.log(name, parent);
    return this.http
      .post<ShopResponse<any>>('http://localhost:3333/api/category', {
        name,
        parent: parent === 'root' ? null : parent,
      })
      .pipe(switchMap(() => this.fetchCategories()));
  }

  updateCategory(id: string, name: string) {
    return this.http
      .put<ShopResponse<any>>('http://localhost:3333/api/category', {
        id,
        name,
      })
      .pipe(
        switchMap(() => this.fetchCategories()),
        catchError(() => this.fetchCategories())
      );
  }

  deleteCategory(id: string) {
    return this.http
      .delete<ShopResponse<any>>(`http://localhost:3333/api/category/${id}`)
      .pipe(switchMap(() => this.fetchCategories()));
  }
}
