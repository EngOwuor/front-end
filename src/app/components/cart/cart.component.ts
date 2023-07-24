import { Component, OnInit } from '@angular/core';
import { CartModelServer } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartData:CartModelServer={

    total:0,
    data:[{
      numInCart:0,
      product: {id:0,image:"",category:'',name:"",description:"",price:0,quantity:0,images:""}
    
    }]
  }

  cartTotal:number=0;
  subTotal:number = 0;

  constructor(public cartService:CartService){}

  ngOnInit(): void {
    this.cartService.cartData$.subscribe(data =>this.cartData = data);
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);
  }

  changeQuantity(index:number,increase:boolean){
    this.cartService.updateCartItem(index,increase);
  }



}
