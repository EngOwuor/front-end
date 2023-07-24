import { Component, OnInit } from '@angular/core';
import { CartModelServer } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{

  authState:boolean = false
  cartData:CartModelServer={

    total:0,
    data:[{
      numInCart:0,
      product: {id:0,image:"",category:'',name:"",description:"",price:0,quantity:0,images:""}
    
    }]
  }
  cartTotal: number = 0

  constructor(private cartService:CartService, private userService:UserService){
  }

  ngOnInit(): void {
    this.cartService.cartTotal$.subscribe(total => this.cartTotal= total);
    this.cartService.cartData$.subscribe(data => this.cartData= data);
    this.userService.authState$.subscribe(authState => this.authState = authState);
  }

  deleteItemFromCart(index:number){
    this.cartService.deleteItemFromCart(index);
  }

  changeQuantity(index:number,increase:boolean){
    this.cartService.updateCartItem(index,increase);
  }


}
