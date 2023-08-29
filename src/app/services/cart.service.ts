import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductService } from './product.service';
import { OrderService } from './order.service';
import { environment } from 'src/environments/environment';
import { CartModelPublic, CartModelServer } from '../models/cart.model';
import { BehaviorSubject } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ProductModelServer } from '../models/product.model';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private serverUrl = environment.serverURL;

  

  // data variable to store cart information on the client's local storage;
  private cartDataClient: CartModelPublic = {
    total:0,
    prodData:[{
      id:0,
      incart:0
    }]
  }

  //data variable to store cart information on the server;
  private cartDataServer:CartModelServer = {

    total:0,
    data:[{
      numInCart:0,
      product: {id:0,image:"",category:'',name:"",description:"",price:0,quantity:0,images:""}
    
    }]
  }

  /*observables for the components to subscribe; */
  cartTotal$ = new BehaviorSubject<number>(0);
  cartData$ = new BehaviorSubject<CartModelServer>(this.cartDataServer);


  constructor(private http:HttpClient, private productService:ProductService, private orderService:OrderService,private router: Router,
    private toastr:ToastrService, private spinner:NgxSpinnerService) { 
    this.cartTotal$.next(this.cartDataServer.total);
    this.cartData$.next(this.cartDataServer);

    // get the information from local storage (if any);
    let info:CartModelPublic = JSON.parse(localStorage.getItem('cart')!);
  
    // check if the info variable is null or has some data in it;
    if(info !== null && info !== undefined && info.prodData[0].incart !==0){

      // localstorage is not empty and has some information;
      this.cartDataClient = info;

      //loop through each entry and put it in the cartDataServer object;
      this.cartDataClient.prodData.forEach(p=>{
        this.productService.getSingleProduct(p.id).subscribe((prod)=>{
          if(this.cartDataServer.data[0].numInCart ===0){
            this.cartDataServer.data[0].numInCart= p.incart;
            this.cartDataServer.data[0].product = prod.product;
            
            // create calculate total function and replace it here;
            this.calculateTotal();
            this.cartDataClient.total = this.cartDataServer.total
            localStorage.setItem('cart',JSON.stringify(this.cartDataClient));

          }else{
            // cartDataServer already has some entry in it;
            this.cartDataServer.data.push({
              numInCart : p.incart,
              product : prod.product
              
            })

            //calculate total ;
            this.calculateTotal();
            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem('cart',JSON.stringify(this.cartDataClient));
          }

          this.cartData$.next({...this.cartDataServer})
        })
      })


    }

  }

  addProductToCart(id:number,quantity?:number){
    this.productService.getSingleProduct(id).subscribe((prod)=>{
      
      // 1. check if the cartDataServer is empty;
      if(this.cartDataServer.data[0].numInCart === 0){
        // cartDataServer is empty;
        this.cartDataServer.data[0].product = prod.product;
        this.cartDataServer.data[0].numInCart = quantity !== undefined ? quantity : 1;
        // calculate total;
        this.calculateTotal();
        this.cartDataClient.prodData[0].id = prod.product.id;
        this.cartDataClient.prodData[0].incart = this.cartDataServer.data[0].numInCart;
        this.cartDataClient.total = this.cartDataServer.total;
        //console.log(this.cartDataClient)
        localStorage.setItem('cart',JSON.stringify(this.cartDataClient));
        this.cartData$.next({... this.cartDataServer});
        //  display toast notification 
        this.toastr.success(`${prod.product.name} added to the cart`,'Product Added',{
          timeOut: 1500,
          progressBar : true,
          progressAnimation : 'increasing',
          positionClass : 'toast-top-right'
        })

      }else{
        // cartDataServer has some items in it;
        let index = this.cartDataServer.data.findIndex(p =>prod.product.id === p.product.id) // returns either -1 or 1;
        //this.resetServerData();
        if(index !== -1){
          // item already exists in cartDataServer
          /*if(quantity !== undefined && quantity <= prod.quantity){
            this.cartDataServer.data[index].numInCart = quantity
          } */ 
          if(quantity !== undefined && quantity <= prod.product.quantity){
            this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart <prod.product.quantity ? quantity:prod.product.quantity;
          }else{
            // quantity is not provided;
           /* this.cartDataServer.data[index].numInCart = */this.cartDataServer.data[index].numInCart <prod.product.quantity ? this.cartDataServer.data[index].numInCart++:prod.product.quantity;
          }

          // calculate total;
          this.calculateTotal();
          this.cartDataClient.prodData[index].incart= this.cartDataServer.data[index].numInCart;
          this.cartDataClient.total = this.cartDataServer.total;
          localStorage.setItem('cart',JSON.stringify(this.cartDataClient));
          this.cartData$.next({... this.cartDataServer});
          // display toast notification 
          this.toastr.info(`${prod.product.name} quantity updated in the cart`,'Product Updated',{
            timeOut: 1500,
            progressBar : true,
            progressAnimation : 'increasing',
            positionClass : 'toast-top-right'
          })
        }else{
          // item is not already in cartDataServer;
          this.cartDataServer.data.push({
            numInCart: 1,
            product:prod.product
          });
          this.cartDataClient.prodData.push({
            id:prod.product.id,
            incart: 1
          })
          // calculate total;
          this.calculateTotal();
          this.cartDataClient.total= this.cartDataServer.total;
          localStorage.setItem('cart',JSON.stringify(this.cartDataClient))
          //display toast notification ;
          this.toastr.success(`${prod.product.name} added to the cart`,'Product Added',{
            timeOut: 1500,
            progressBar : true,
            progressAnimation : 'increasing',
            positionClass : 'toast-top-right'
          })
          this.cartData$.next({... this.cartDataServer})
        }
      }
    })
  }

  updateCartItem(index:number,increase:boolean){
    let item = (this.cartDataServer.data[index]);

    if(increase){
      item.numInCart < item.product.quantity ? item.numInCart ++ : item.product.quantity;
      this.cartDataClient.prodData[index].incart= item.numInCart;
      // calculate the total;
      this.calculateTotal();
      this.cartDataClient.total = this.cartDataServer.total;
      localStorage.setItem('cart',JSON.stringify(this.cartDataClient));
      this.cartData$.next({...this.cartDataServer});
      
    }else{
      item.numInCart --;
      if(item.numInCart < 1){
        //  console.log(this.cartDataServer.data[index])
        //delete the product from both cart;
        this.deleteItemFromCart(index);
       // console.log(this.cartDataServer.data[index])
      }
      //this.cartDataClient.prodData[index].incart= this.cartDataServer.data[index].numInCart;
      //  calculate the total;
      this.calculateTotal();
      this.cartDataClient.total = this.cartDataServer.total;
      localStorage.setItem('cart',JSON.stringify(this.cartDataClient));
      this.cartData$.next({...this.cartDataServer});

    }
  }

  deleteItemFromCart(index:number){
    if(window.confirm('Are you sure you want to delete the item?')){
      this.cartDataServer.data.splice(index,1);
      this.cartDataClient.prodData.splice(index,1);
      // calculate total;
      this.calculateTotal();
      this.cartDataClient.total = this.cartDataServer.total;

      if(this.cartDataServer.total === 0){
        this.cartDataServer = {total:0,data:[{numInCart:0,product:{id:0,image:"",category:'',name:"",description:"",price:0,quantity:0,images:""}}]}
      }

      if(this.cartDataClient.total===0){
        this.cartDataClient = { total:0,prodData:[{id:0,incart:0}]}
      }
      localStorage.setItem('cart',JSON.stringify(this.cartDataClient));
      this.cartData$.next({...this.cartDataServer});

    }else{
      //the user clicks cancel button;
      if(this.cartDataServer.data[index].numInCart < 1){
        
        this.cartDataServer.data[index].numInCart =1
      }
        
      //return
      
      
    }
    
    

  }
  private calculateTotal(){
    let total = 0
    this.cartDataServer.data.forEach(p=>{
     const {numInCart}=p;
     const {price} = p.product;
     total += price*numInCart
     
    })
    this.cartDataServer.total = total;
    this.cartTotal$.next(this.cartDataServer.total);
  }

  calculateSubtotal(index:number):number{
    let subTotal = 0;
    let p = this.cartDataServer.data[index];
    let price = p.product.price;
    let numInCart = p.numInCart;
    subTotal = price*numInCart;
    return subTotal
  }

  checkOutFromCart(userId:number){
    this.http.post<PaymentResponse>(`${this.serverUrl}/orders/payment`,null).subscribe((res)=>{
      if(res.success){
        //console.log(res.success)
        this.resetServerData();
        this.http.post<OrderResponse>(`${this.serverUrl}/orders/new`,{
          userId: userId,
          products:this.cartDataClient.prodData
        }).subscribe(newOrderRes=>{
          console.log(newOrderRes)
          this.orderService.getSingleOrder(newOrderRes.order_id).subscribe(orderItems =>{
            if(newOrderRes.success){
              const navigationExtras:NavigationExtras = {
                state:{
                  message: newOrderRes.message,
                  products:orderItems,
                  orderId:newOrderRes.order_id,
                  total:this.cartDataClient.total
                }
              }
              //console.log(navigationExtras)
              // hide spinner
              this.spinner.hide().then();
              this.router.navigate(['/thankyou'],navigationExtras).then(p=>{
                //console.log(p)
                this.cartDataClient =  { total:0,prodData:[{id:0,incart:0}]};
                this.cartTotal$.next(0);
                localStorage.setItem('cart',JSON.stringify(this.cartDataClient));
              })
            }
          })
           
        })
      }else{
        this.spinner.hide().then();
        this.router.navigateByUrl('/checkout').then();
        this.toastr.error('Sorry, failed to book the order','Order Status',{
          timeOut: 1500,
          progressBar : true,
          progressAnimation : 'increasing',
          positionClass : 'toast-top-right'
        })
      }
    })
  }

  private resetServerData(){
    this.cartDataServer = {
      total:0,
      data:[{
        numInCart:0,
        product:  {id:0,image:"",category:'',name:"",description:"",price:0,quantity:0,images:""}
      
      }]
    }
    this.cartData$.next({... this.cartDataServer})
  }
}

interface PaymentResponse {
  success : boolean
}

interface OrderResponse {
  order_id :number
  success :boolean;
  message : string;
  products : [{
    id : string;
    numInCart : string
  }];
}

