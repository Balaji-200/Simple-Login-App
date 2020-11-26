import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { User } from '../model/user';
import { AuthService } from '../services/auth.service';
import { Router } from "@angular/router";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  // professions:String[]=[ 
  //   'BBSc Nursing',
  //   'PBBSc Nursing',
  //   'GNM',
  //   'ANM'
  // ];

  // courses: String[]=[
  //   'First Year',
  //   'Second Year',
  //   'Third Year',
  //   'Fourth Year'
  // ]

  passHide: Boolean = true;

  signUp: User;

  signupForm: FormGroup;

  formErrors = {
    "username": '',
    "email": '',
    "password": ''
  };

  validationMessages = {
    'username': {
      'required': 'Username is required.'
    },
    'email': {
      'required': 'E-mail id is required'
    },
    'password': {
      'required': 'Password is required.',
      'minlength': 'Password must be atleast 8 characters long.'
    }
  };

  constructor(private fb: FormBuilder,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.createForm();
    this.signupForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  createForm() {
    this.signupForm = this.fb.group({
      "username": ['', [Validators.required]],
      "email": ['', Validators.required],
      "password": ['', [Validators.required, Validators.minLength(8)]]
    })
  }

  onSubmit() {
    if (this.signupForm.valid)
      this.auth.signup(this.signupForm.value).subscribe(
        res => this.openSnackBar(res.message ? res.message : '', "/"),
        err => this.openSnackBar(err.error.message, "/"));
  }
  openSnackBar(message: string, navigateTo: string) {
    this.snackBar.open(message, 'OK', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      // panelClass: ["custom-snackbar-class"]
    }).afterDismissed().subscribe(info => info.dismissedByAction ? this.router.navigate([navigateTo]) : this.router.navigate([navigateTo]))
  }
  onValueChanged(data?: any) {
    if (!this.signupForm) { return; }
    const form = this.signupForm;
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
  ngOnInit(): void {
  }

}
