import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  message: string;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.dashboard().subscribe(res=> this.message=res.username,err=>{
      if(err.status==401){
        localStorage.setItem('j','');
        this.router.navigate(["/"]);
      }
    });
  }

   onLogout(){
    this.authService.logout().subscribe(res=>{
      if(res.success){
        localStorage.setItem('j','');
        this.router.navigate(["/"]);
      }
    },err=>{
      if(err.status == 401){
        localStorage.setItem('j','');
        this.router.navigate(["/"]);
      }
    });
   }

  ngOnInit(): void {
  }

}
