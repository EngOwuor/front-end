import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  auth:boolean = false;
  authId : number = -1
  private serverUrl : string = environment.serverURL;
  private user:UserResponseModel = {token:"",auth:false,email:"",username:"" ,/*,fname:"",lname:"",
    photoUrl:"",*/
    userId:0 
  }
  authState$:BehaviorSubject<boolean> = new BehaviorSubject(this.auth);
  authId$:BehaviorSubject<number> = new BehaviorSubject(this.authId);
  authData$ : BehaviorSubject<UserResponseModel> = new BehaviorSubject(this.user);

  constructor( private http: HttpClient, private router: Router) { }

  // login user with email and password
  loginUser(email:string,password:string): void{
   this.http.post<UserResponseModel>(`${this.serverUrl}/auth/login`, {email,password})
   .subscribe(userData =>{
    console.log(userData)
    this.auth = userData.auth;
    this.authState$.next(this.auth);
    this.authId = userData.userId;
    this.authId$.next(userData.userId);
    this.authData$.next(userData);
    
    console.log(this.authId$.value)
  
   })
  }

  // register user with fname,lname,email and password
  registerUser(fname:string,lname:string,email:string,password:string): void{
    this.http.post(`${this.serverUrl}/auth/register`, {fname,lname,email,password})
   .subscribe(userData =>{
    // @ts-ignore
    if(userData.insertId !== null){
      this.router.navigateByUrl('/');
      window.alert('Registration successful, welcome')
      this.loginUser(email,password)
    }
      // @ts-ignore
      console.log(userData)
     //this.auth = userData.auth;
     //this.authState$.next(this.auth);
     //this.authData$.next(userData)
    })
   }

  logOutUser(){
    this.auth = false;
    this.authState$.next(this.auth);
  }
}

interface UserResponseModel {
  token: string;
  auth:boolean;
  email:string;
  username:string;
  /*fname:string;
  lname:string;
  photoUrl:string;*/
  userId:number 
}

interface RegisterUserResponseModel {
  message:string;
  insertId:number | null
}
