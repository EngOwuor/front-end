import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private products:ProductResponseModel[]= [];
  private serverUrl=environment.serverURL;   

  constructor(private http:HttpClient) { }

  getSingleOrder(orderId:number):Observable<ProductResponseModel[]>{
    return this.http.get<ProductResponseModel[]>(this.serverUrl+'/orders/details/'+orderId)
  }
}

interface ProductResponseModel{
  id:number,
  title:string,
  description:string,
  price:number,
  quantityOrdered:number,
  image:string
}
