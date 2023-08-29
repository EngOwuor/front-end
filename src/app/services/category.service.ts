import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
//import {switchMap} from 'rxjs/operators';

import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private serverUrl=environment.serverURL

  constructor(private httpClient: HttpClient) { 
  }

  getAllCategories(): Observable<CategoriesObject> {
    return this.httpClient.get<CategoriesObject>(this.serverUrl+'/categories ');
  }

  addNewCategory(category:string){
    return this.httpClient.post(this.serverUrl+'/categories/new',{category})

  }
}


interface CategoriesObject {
  count : number;
  categories : [{id:number,title:string }]
}
