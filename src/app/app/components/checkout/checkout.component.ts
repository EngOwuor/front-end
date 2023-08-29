import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CartModelServer } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit{

  cartTotal:number = 0;
  cartData:CartModelServer = {

    total:0,
    data:[{
      numInCart:0,
      product: {id:0,image:"",category:'',name:"",description:"",price:0,quantity:0,images:""}
    
    }]
  }
  constructor(private cartService:CartService,
    private orderService:OrderService,
    private router:Router,
    private spinner:NgxSpinnerService,
    private userService:UserService){

  }
  
  ngOnInit(): void {
   this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);
   this.cartService.cartData$.subscribe(data => this.cartData = data) 
  }

  onCheckout(){
     if(this.userService.authId$.value < 0){
      window.alert('please login or create account to continue');
      return
    }else{
     this.spinner.show().then(p =>{
     this.cartService.checkOutFromCart(this.userService.authId$.value);
      console.log(this.userService.authId$.value)})
    }
     
  }

}
