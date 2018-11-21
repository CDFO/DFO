import { Routes, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Params } from "@angular/router";
import { DashboardComponent } from './dashboard/dashboard.component';
import { RequestsComponent } from './requests/requests.component';
import { ReportsComponent } from './reports/reports.component';
import { ManageComponent } from './manage/manage.component';
import { NoPageComponent } from './no-page/no-page.component';
import { WelcomeComponent } from "./welcome/welcome.component";
import { CatalogComponent } from "./catalog/catalog.component";
import { NotificationsComponent } from "./notifications/notifications.component";
import { ProfileComponent } from "./profile/profile.component";
import { CartComponent } from "./cart/cart.component";
import { LoginComponent } from "./login/login.component";
import { TmpComponent } from "./tmp/tmp.component";
import {NeedAuthGuard} from './_guards/auth.guard';

//Array of routes
export const routes: Routes = [
    //{path: '', component: HomeComponent},
    {path: '', pathMatch: 'full', redirectTo: 'welcome'},
    {path: 'welcome', component: WelcomeComponent, canActivate: [NeedAuthGuard]},
    {path: 'dashboard', component: DashboardComponent, canActivate: [NeedAuthGuard]},
    {path: 'requests', component: RequestsComponent, canActivate: [NeedAuthGuard]},
    {path: 'catalogue', component: WelcomeComponent, canActivate: [NeedAuthGuard]},
    {path: 'catalogue/:category', component: CatalogComponent, canActivate: [NeedAuthGuard]},
    {path: 'reports', component: ReportsComponent, canActivate: [NeedAuthGuard]},
    {path: 'manage', component: ManageComponent, canActivate: [NeedAuthGuard]},
    {path: 'cart', component: CartComponent, canActivate: [NeedAuthGuard]},
    {path: 'profile', component: ProfileComponent, canActivate: [NeedAuthGuard]},
    {path: 'notifications', component: NotificationsComponent, canActivate: [NeedAuthGuard]},
    {path: 'login', component: LoginComponent},
    {path: 'tmp', component: TmpComponent},
    {path: '**', component: NoPageComponent}

];