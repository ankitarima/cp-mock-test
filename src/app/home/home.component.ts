import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public mockTests = [] as any;
  public placeholderImg = "assets/images/mock-test-image-placeholder.png"
  public qArray = [] as any

  constructor(
    private db:AngularFirestore,
    private http: HttpClient

  ) { }

  ngOnInit(): void {
    this.db.collection('mock_category').get().subscribe((resp)=>{
      resp.forEach((data=>{
        const test = data.data();
        this.mockTests.push(test)
      }))
      // console.log(this.mockTests)
      localStorage.setItem('category_array',JSON.stringify(this.mockTests))
    })

    // this.db.collection('questions').ref.where('mock_test', 'array-contains', 'wbjee-sample-paper-1-physics-chemistry').get().then((resp) => {
    //   let qno = 1;
    //   resp.docs.forEach((data => {
    //     const question = data.data() as any;
    //     // delete question.correct_option;
    //     const qObj = Object.assign({}, question, { ['qno']: qno, ['id']: data.id, ['for_review']: false, ['answer']: null })

    //     this.qArray.push(qObj)
    //       qno++;
    //   }))

    //   console.log(this.qArray);

    // })


    // this.http.get('assets/questionlist.json').subscribe((resp:any)=>{
    //   const arr = Array.from(Object.keys(resp), k=>[resp[k]]);
    //   console.log(arr);
    //   let q =1;
    //   arr.forEach((item:any) => {

    //     this.db.collection('questions').add(item[0]).then(()=>{
    //       console.log(item[0]);
    //       console.log(q);
    //       q++;
    //     })
    //   });

    // })
  }

}
