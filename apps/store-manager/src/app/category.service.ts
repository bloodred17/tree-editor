import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

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
}
