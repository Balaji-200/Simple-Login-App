import { Component, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { User } from '../model/user';
import { AuthService } from '../services/auth.service';
import { Router } from "@angular/router";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
@Injectable({
  providedIn:'root'
})
export class LoginComponent implements OnInit {

  passHide: Boolean = true;

  loggedIn : Boolean = false;

  response: String;

  login: User

  loginForm: FormGroup;

  formErrors = {
    'username': '',
    'password': ''
  };

  validationMessages = {
    'username': {
      'required': 'Username is required.',
    },
    'password': {
      'required': 'Password is required.',
      'minlength': 'Password must be at least 8 characters long.',
    }
  };

  constructor(private fb: FormBuilder, private authService: AuthService, private snackBar: MatSnackBar, private router: Router) {
    this.createForm();
    this.loginForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  createForm() {
    this.loginForm = this.fb.group({
      "username": ["", Validators.required,],
      "password": ["", [Validators.required, Validators.minLength(8)]]
    })
  }
  ngOnInit(): void {
  }
  onSubmit() {
    // console.log(this.loginForm.value);
    this.authService.login(this.loginForm.value).subscribe(res=> {
      this.openSnackBar(res.message?res.message:'',"dashboard");
      localStorage.setItem('j',res.token); 
      this.loggedIn = res.success;
      this.response=JSON.stringify(res);
      // console.log(this.loggedIn)
    }, err=>{
      if(err){
        this.openSnackBar(err.error.mess?err.error.mess:'', "/");
      }
    })
  }

  openSnackBar(message: string, navigateTo: string) {
    this.snackBar.open(message, 'OK', {
      duration: 2000,
      horizontalPosition: <MatSnackBarHorizontalPosition>"center",
      verticalPosition: <MatSnackBarVerticalPosition>"bottom",
      // panelClass: ["custom-snackbar-class"]
    }).afterDismissed().subscribe(info=> info.dismissedByAction?this.router.navigate([navigateTo]):this.router.navigate([navigateTo]))
  }

  onValueChanged(data?: any) {
    if (!this.loginForm) { return; }
    const form = this.loginForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
}
