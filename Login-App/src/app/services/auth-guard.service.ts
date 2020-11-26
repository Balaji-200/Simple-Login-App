import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router) { }

  canActivate() {
    if (localStorage.getItem('j') != null || localStorage.getItem('j') != '') {
      return true;
    } else {
      this.router.navigate(["/"])
      return false;
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class LoggedInService implements CanActivate {

  constructor(private router: Router) { }

  canActivate() {
    if (localStorage.getItem('j') === null || localStorage.getItem('j') == '') {
      return true;
    } else {
      this.router.navigate(["dashboard"]);
      return false;
    }
  }
}