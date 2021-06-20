import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.css']
})
export class InstructionsComponent implements OnInit {

  public isLoading = true;
  public startBtn = false;
  public slug: any
  public test = [] as any;
  public qArray = [] as any;

  constructor(
    private db: AngularFirestore,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    public afAuth: AngularFireAuth
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => { this.slug = params.slug });
    this.db.collection('mock_tests_new').ref.where('slug', '==', this.slug).get().then((resp)=>{
      resp.forEach((data)=>{
        this.test.push(data.data())
      })
      console.log(this.test)
      this.isLoading = false
    })
    this.db.collection('questions').ref.where('mock_test', 'array-contains', this.slug).get().then((resp) => {
      let qno = 1;
      resp.docs.forEach((data => {
        const question = data.data() as any;
        // delete question.correct_option;
        const qObj = Object.assign({}, question, { ['qno']: qno, ['id']: data.id, ['for_review']: false, ['answer']: null })

        this.qArray.push(qObj)
          qno++;
      }))
      console.log(this.qArray)
      if (this.qArray.length > 0) {
        // localStorage.setItem('qArray', JSON.stringify(this.qArray));
        localStorage.setItem('duration', this.test[0].total_duration);
        localStorage.setItem('total_marks', this.test[0].total_score);
        localStorage.setItem('test_name', this.test[0].test_name);
        localStorage.setItem('test_slug', this.test[0].slug);
        localStorage.setItem('pvm',this.test[0].postive_mark);
        localStorage.setItem('nvm',this.test[0].negetive_mark);
        this.startBtn = true;
      } else {
        alert('Test is not ready or contact admin');
        this.location.back();

      }
    }).catch((err) => {
      console.log(err);
      alert('Something wrong. Try after some time or report to admin')
    })
  }

  start() {
    this.router.navigate(['/test/exam']);
  }

  back(){
    alert('You cannot signout, when test is in progress ...')

  }

}
