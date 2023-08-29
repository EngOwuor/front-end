import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { serverResponse } from 'src/app/models/product.model';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  categoryProducts:any[]=[]; 
  p: number = 1;
  collection: any[] = [];

  searchTerm:string = '';

  constructor(private productService:ProductService,
              private router:Router,
              private cartService:CartService){}

  ngOnInit(): void {
    
    
    this.productService.searchString.subscribe(val=>{
      //console.log(val)
      this.searchTerm = val
    })

    this.productService.categoryProductsObj.subscribe({
      next: res =>{
        //console.log(res)
        this.collection = res.products
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

  pageChanged(event:any):void{
    this.p = event;
    this.productService.catProductspageNumber.next(this.p)
  }


}
