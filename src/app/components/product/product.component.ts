import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ProductModelServer, ServerProdResponse } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

//import * as $ from "jquery"

declare let $:any



@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, AfterViewInit{

  //@ts-ignore
  @ViewChild('quantity') quantityInput:ElementRef 
  id:number =0;
  product:ServerProdResponse = {
    product: {
      id: 0,
      name: '',
      category: '',
      description: '',
      image: '',
      price: 0,
      quantity: 0,
      images: ''
    }
  };
  thumbImages:any[] = [];

  constructor(private productService:ProductService,
              private cartService:CartService,
              private route: ActivatedRoute){

  }

  ngOnInit(): void {
    this.route.paramMap
    .pipe(map(param=>{
      // @ts-ignore
      return param.params.id
    }))
    .subscribe(prodId =>{
      this.id = prodId;
      this.productService.getSingleProduct(this.id).subscribe(prod =>{
        console.log(prod)
        this.product = prod;
        if (prod.product.images !== null){
          this.thumbImages = prod.product.images.split(';')
          console.log(this.thumbImages)
        }
      })

    })
    
  }

  ngAfterViewInit(): void {
    
    // Product Main img Slick
    $('#product-main-img').slick({
      infinite: true,
      speed: 300,
      dots: false,
      arrows: true,
      fade: true,
      asNavFor: '#product-imgs',
    });

    // Product imgs Slick
    $('#product-imgs').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: true,
      centerMode: true,
      focusOnSelect: true,
      centerPadding: 0,
      vertical: true,
      asNavFor: '#product-main-img',
      responsive: [{
        breakpoint: 991,
        settings: {
          vertical: false,
          arrows: false,
          dots: true,
        }
      },
      ]

    });

    // Product img zoom
    var zoomMainProduct = document.getElementById('product-main-img');
    if (zoomMainProduct) {
      $('#product-main-img .product-preview').zoom();
    }
  }

  increase(){
    let value = parseInt(this.quantityInput.nativeElement.value);
    if(this.product.product.quantity >= 1){
      value ++;
      if(value > this.product.product.quantity){
        value = this.product.product.quantity;
      }
    }else{
      return
    }

    this.quantityInput.nativeElement.value = value
  }

  decrease(){
    let value = parseInt(this.quantityInput.nativeElement.value);
    if(this.product.product.quantity >= 1){
      value --;
      if(value <= 0){
        value = 1;
      }
    }else{
      return
    }

    this.quantityInput.nativeElement.value = value
  }

  addToCart(id:number){
    this.cartService.addProductToCart(id,this.quantityInput.nativeElement.value)
  }

}


