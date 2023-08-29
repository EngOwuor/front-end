import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { error } from 'jquery';
import { serverResponse } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  products:any[]=[];
  p: number = 1;
  totalItems:number = 0;
  collection: any[] = [];
  searchTerm:string = '';

  constructor(private productService:ProductService, private router:Router, private cartService:CartService){}

  ngOnInit() {

    this.productService.getAllProducts().subscribe((prods:serverResponse)=>{
      

      this.collection = prods.products;
      this.totalItems = prods.count

      //console.log(this.products)
      //console.log(this.collection)

    })
    
    this.productService.searchString.subscribe(val=>{
      //console.log(val)
      this.searchTerm = val
    })

    this.productService.categoryProductsObj.subscribe({
      next: res =>{
        //console.log(res)
        this.products = res.products
      },
      error: err => console.log(err)
    })

    
  }

  selectProduct(id:number){
    this.router.navigate(['/product',id])
  }
  
  addToCart(id:number){
    this.cartService.addProductToCart(id);
  
  }

  getCategoryProducts():void{
    this.productService.categoryProductsObj.subscribe({
      next: res =>{
        console.log(res)
      },
      error: err => console.log(err)
    })
  }

  pageChanged(event:any):void{
    this.p = event;
    this.productService.getAllProducts().subscribe((prods:serverResponse)=>{
      

      this.collection = prods.products

      console.log(this.products)
      console.log(this.collection)

    })

  }

  

}
