import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.css']
})
export class ThankyouComponent implements OnInit {

  message:string ="";
  orderId:number=0;
  products: ProductsResponseModel = {
    count: 0,
    orders:[{
      id:0,
      name:"",
      description: "",
      price:0,
      quantity:0,
      image:""
    }]
  };
  cartTotal : number=0;

  constructor(private router:Router, private orderService:OrderService){
    const navigation = this.router.getCurrentNavigation();
    console.log(navigation?.extras)
    const state1 = navigation?.extras.state;
    console.log(state1)
    const state = navigation?.extras.state as {
      message:string,
      products:ProductsResponseModel,
      orderId:number,
      total:number
    }
    this.message = state.message;
    this.orderId = state.orderId;
    this.products = state.products;
    this.cartTotal = state.total
  }

  ngOnInit(): void {
    
  }


}

interface ProductResponseModel {
  id:number;
  name:string;
  description: string;
  price:number;
  quantity:number;
  image:string
}
interface ProductsResponseModel {
  count: number;
  orders: ProductResponseModel[]
}
