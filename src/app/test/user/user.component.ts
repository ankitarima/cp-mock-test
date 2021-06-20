import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  public results = [] as any;
  public user:any
  public isloading = true;

  constructor(
    private db: AngularFirestore,
    private afAuth: AngularFireAuth
  ) { }

  ngOnInit(): void {

    this.user = JSON.parse(localStorage.getItem('user') || "[]")

    if(this.user){
      this.db.collection('mock_results').ref.where('uid', '==', this.user.uid).get().then((results)=>{
        results.forEach((result:any)=>{
          this.results.push(result.data());
          // console.log(result.data().result.physics)
        })

        // this.results.sort(function(x: { timestamp: number; }, y: { timestamp: number; }){
        //   return y.timestamp - x.timestamp;
        // })

        this.isloading = false;
      })
    }

    console.log(this.results)

  }

}
