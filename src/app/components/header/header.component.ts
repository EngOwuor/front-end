import { Component, OnInit } from '@angular/core';
import { CartModelServer } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';
import { ProductModelServer, ServerProdResponse, serverResponse } from 'src/app/models/product.model';
import { Router } from '@angular/router';

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
  cartTotal: number = 0;
  searchTerm:string = '';
  categories:Category[] = [];
  categoryId:number = 0;
  categoryProductsObj: serverResponse = {
    count:0,
    products:[]
  }
  p: number = 1;
  collection: any[] = [];

  constructor(private cartService:CartService, 
              private userService:UserService,
              private productService:ProductService,
              private categoryService:CategoryService,
              private router:Router){
  }

  ngOnInit(): void {
    this.cartService.cartTotal$.subscribe(total => this.cartTotal= total);
    this.cartService.cartData$.subscribe(data => this.cartData= data);
    this.userService.authState$.subscribe(authState => this.authState = authState);
    this.productService.catProductspageNumber.subscribe({
      next:pagenumber=>{
        this.p = pagenumber;
      },
      error:err =>console.log(err)
    })
    this.categoryService.getAllCategories().subscribe({
      next:catObject=>{
        this.categories = catObject.categories
      },
      error:err =>console.log(err)
    })
  }

  deleteItemFromCart(index:number){
    this.cartService.deleteItemFromCart(index);
  }

  changeQuantity(index:number,increase:boolean){
    this.cartService.updateCartItem(index,increase);
  }
  
  search(event:any){
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.productService.searchString.next(this.searchTerm)
  }

  getCategoryProducts(value:string){
    //console.log(value)

    this.productService.getAllCategoryProducts(this.p,10,value).subscribe({
      next:serverRes =>{
        //console.log(serverRes)
        this.categoryProductsObj = serverRes;
        this.productService.categoryProductsObj.next(this.categoryProductsObj)
      },
      error : err => console.log(err)
    })
    
    if(+value === 0){
      this.router.navigateByUrl('/');
    }else{
      this.router.navigateByUrl('/category');
    }

  }

}

interface Category {
  id:number;
  title:string
}
