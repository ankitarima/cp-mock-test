import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  public slug:any
  public cta = [] as any;
  public category:any
  public tests = [] as any;
  public isLoading = false;
  public message = "loading...";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private db: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.route.params.subscribe(params => { this.slug = params.slug });
    this.cta = JSON.parse(localStorage.getItem('category_array') || "[]")
    this.category = this.cta.filter((val:any) => {
      if (val.slug == this.slug) {
        return val
      }
    })

    this.db.collection('mock_tests_new').ref.where('category', '==', this.slug).get().then(resp=>{

      resp.forEach((elemet: any)=>{
        if(elemet.data().status === 'public'){
          this.tests.push(elemet.data())
        }
      })

    }).then(()=>{
      this.isLoading = false;
      console.log(this.tests)
      if(this.tests.length == 0 ){
        this.message = "comming soon! stay connected  😃 ";
        this.isLoading = true;
      }
    }).catch((err)=>{
      this.message = "❌ [Pls try after some time or contact admin]"
      this.isLoading = true
    })

  }

}
