import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  fname:string="";
  lname:string=""
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
        this.router.navigateByUrl('/register');
      }
    })
  }
  
  register(form:NgForm): void{
    const fname = this.fname;
    const lname = this.lname
    const email = this.email;
    const password = this.password;
    if(form.invalid){
      return
    }
    //form.reset();
    this.userService.registerUser(fname,lname,email,password)
  }
  

}


