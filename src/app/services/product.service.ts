import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductModelServer, ServerProdResponse, serverResponse } from '../models/product.model';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private serverUrl=environment.serverURL;

  public searchString = new BehaviorSubject<string>('');
  public catProductspageNumber = new BehaviorSubject<number>(1);
  public categoryProductsObj= new BehaviorSubject<serverResponse>({count:0,products:[]})

  constructor(private http:HttpClient) { }

  getAllProducts(page=1,limitOfResults=10): Observable<serverResponse> {
    return this.http.get<serverResponse>(this.serverUrl + '/products', {
      params: {
        page: page,
        limit: limitOfResults.toString()
      }
    });
  }
  // get single product from server
  getSingleProduct(id:number):Observable<ServerProdResponse>{
    return this.http.get<ServerProdResponse>(this.serverUrl +'/products/'+id);

  }

  // get products for one category
  getAllCategoryProducts(page:number,limit:number,catId:string):Observable<serverResponse>{
    return this.http.post<serverResponse>(this.serverUrl+'/products/category',
    {page:page,limit:limit,id:catId}
    );

  }
}
