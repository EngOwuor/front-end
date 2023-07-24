import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { ProductComponent } from "./components/product/product.component";
import { CartComponent } from "./components/cart/cart.component";
import { CheckoutComponent } from "./components/checkout/checkout.component";
import { ThankyouComponent } from "./components/thankyou/thankyou.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { LoginComponent } from "./components/login/login.component";
import { profileGuard } from "./components/guard/profile.guard";
import { RegisterComponent } from "./components/register/register.component";

const routes: Routes = [
    {path:'product/:id',component:ProductComponent},
    {path:'cart',component:CartComponent},
    {path:'checkout',component:CheckoutComponent},
    {path:'thankyou',component:ThankyouComponent},
    {path:'login',component: LoginComponent},
    {path:'profile',component:ProfileComponent,canActivate:[profileGuard]},
    {path:'register',component:RegisterComponent},
    {path:'', component:HomeComponent },
];

@NgModule({
    imports:[RouterModule.forRoot(routes)],
    exports:[RouterModule]
})

export class AppRoutingModule { }