import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth'
import firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public states=["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jammu and Kashmir","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttarakhand","Uttar Pradesh","West Bengal","Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli","Daman and Diu","Delhi","Lakshadweep","Puducherry"];

  public message:any;
  public isloading = false as any;

  public loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators['required'])
  })

  public signupForm = new FormGroup({
    name: new FormControl('', Validators.required),
    mobile: new FormControl('', Validators.required),
    class: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    semail: new FormControl('', [Validators.required, Validators.email]),
    spassword: new FormControl('',)
  })

  public saveForm = new FormGroup({
    guid: new FormControl(''),
    gname: new FormControl('', Validators.required),
    gmobile: new FormControl('', Validators.required),
    gclass: new FormControl('', Validators.required),
    gstate: new FormControl('', Validators.required)
  })


  constructor(
    public afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {

    // console.log();

    this.afAuth.user.subscribe((userCrendeials)=>{
      const user = [] as any
      this.db.collection('mock_users').ref.where('uid', '==', userCrendeials?.uid).get().then((resp)=>{
        resp.forEach((data)=>{
          user.push(data.data())
        })
      }).then(()=>{
        if(user.length == 0){
          this.saveForm.patchValue({
            gname: userCrendeials?.displayName,
            guid: userCrendeials?.uid
          });
          let saveModal: HTMLElement = document.getElementById('saveModal') as HTMLElement;
          saveModal.click();
        }
      })
    })
  }

  login(){
    this.isloading =true;
    this.afAuth.signInWithEmailAndPassword(this.loginForm.value.email, this.loginForm.value.password).then((resp)=>{
      localStorage.setItem('user', JSON.stringify(resp.user))
    }).catch((err)=>{
      this.message = err;
      this.isloading = false;
    })
  }

  glogin(){
    const gAP = new firebase.auth.GoogleAuthProvider();
    this.afAuth.signInWithPopup(gAP).then((userCrendeials)=>{
      localStorage.setItem('user', JSON.stringify(userCrendeials.user))
      const user = [] as any
      this.db.collection('mock_users').ref.where('uid', '==', userCrendeials.user?.uid).get().then((resp)=>{
        resp.forEach((data)=>{
          user.push(data.data())
        })
      }).then(()=>{
        if(user.length == 0){
          let logincbtn: HTMLElement = document.getElementById('logincbtn') as HTMLElement;
          logincbtn.click();
          let element: HTMLElement = document.getElementById('signupcbtn') as HTMLElement;
          element.click();
          this.saveForm.patchValue({
            gname: userCrendeials.user?.displayName,
            guid: userCrendeials.user?.uid
          });
          let saveModal: HTMLElement = document.getElementById('saveModal') as HTMLElement;
          saveModal.click();
        }else{

          let logincbtn: HTMLElement = document.getElementById('logincbtn') as HTMLElement;
          logincbtn.click();
          let element: HTMLElement = document.getElementById('signupcbtn') as HTMLElement;
          element.click();
        }
      })
    })
  }

  signup(){
    this.isloading = true;
    if(this.signupForm.invalid){
      alert('All fields are required');
      this.isloading = false;
      return
    }else if(this.signupForm.value.spassword === ''){
      alert('All fields are required');
      this.isloading = false;
      return
    }else{
      this.afAuth.createUserWithEmailAndPassword(this.signupForm.value.semail, this.signupForm.value.spassword).then((userCredentials)=>{
        localStorage.setItem('user', JSON.stringify(userCredentials.user))
        const user = firebase.auth().currentUser;
        user?.updateProfile({
          displayName: this.signupForm.value.name
        }).then(()=>{
          this.db.collection('mock_users').doc(userCredentials.user?.uid).set({
            uid: userCredentials.user?.uid,
            name: this.signupForm.value.name,
            email: this.signupForm.value.semail,
            mobile: this.signupForm.value.mobile,
            class: this.signupForm.value.class,
            state: this.signupForm.value.state
          }).then(()=>{
            let element: HTMLElement = document.getElementById('signupcbtn') as HTMLElement;
            element.click();
            this.signupForm.reset();
            this.isloading = false;
          })
        })
      }).catch((err)=>{
        console.log(err.message)
        this.message = err;
        this.isloading = false;
      })

    }
  }

  save(){
    this.isloading = true
    if(this.saveForm.invalid){
      alert('All fields are required');
      this.isloading = false;
      return
    }else{
      this.db.collection('mock_users').doc(this.saveForm.value.guid).set({
        uid: this.saveForm.value.guid,
        name: this.saveForm.value.gname,
        mobile: this.saveForm.value.gmobile,
        class: this.saveForm.value.gclass,
        state: this.saveForm.value.gstate
      }).then(()=>{
        let element: HTMLElement = document.getElementById('savecbtn') as HTMLElement;
        element.click();
        this.saveForm.reset();
        this.isloading = false;
      })
    }
  }

  clear(){
    this.message = null;
    this.signupForm.reset();
    this.loginForm.reset();
  }

  logOut(){
    this.afAuth.signOut();
    localStorage.clear()
    this.router.navigate(['/']);
  }

}
