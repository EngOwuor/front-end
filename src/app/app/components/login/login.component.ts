import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  email:string="";
  password:string = "";

  constructor(private router:Router,
              private userService:UserService,
              private route:ActivatedRoute){}
  
  ngOnInit(): void {
    this.userService.authState$.subscribe(authState =>{
      if(authState){
        // navigate to profile
        //this.router.navigateByUrl(this.route.snapshot.queryParams['returnUrl'] || '/profile')
        //navigate to hom
        this.router.navigateByUrl('/')
      }else{
        this.router.navigateByUrl('/login');
      }
    })
  }
  
  login(form:NgForm): void{
    const email = this.email;
    const password = this.password;
    if(form.invalid){
      return
    }
    form.reset();
    this.userService.loginUser(email,password)
    
  }
  

}
