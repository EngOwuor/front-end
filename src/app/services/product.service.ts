import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ProductModelServer, ServerProdResponse, serverResponse } from '../models/product.model';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private serverUrl=environment.serverURL

  constructor(private http:HttpClient) { }

  getAllProducts(limitOfResults=10): Observable<serverResponse> {
    return this.http.get<serverResponse>(this.serverUrl + '/products', {
      params: {
        limit: limitOfResults.toString()
      }
    });
  }
  // get single product from server
  getSingleProduct(id:number):Observable<ServerProdResponse>{
    return this.http.get<ServerProdResponse>(this.serverUrl +'/products/'+id);

  }

  // get products for one category
  getProductsFromCategory(catName:string):Observable<ProductModelServer[]>{
    return this.http.get<ProductModelServer[]>(this.serverUrl+'/products/category/'+catName);

  }
}
