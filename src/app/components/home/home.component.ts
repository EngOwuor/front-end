import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { serverResponse } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  products:any[]=[]

  constructor(private productService:ProductService, private router:Router, private cartService:CartService){}

  ngOnInit() {

    this.productService.getAllProducts().subscribe((prods:serverResponse)=>{
      

      this.products = prods.products

      //console.log(this.products)

    })
    
  }

  selectProduct(id:number){
    this.router.navigate(['/product',id])
  }
  
  addToCart(id:number){
    this.cartService.addProductToCart(id);
  
  }

}
