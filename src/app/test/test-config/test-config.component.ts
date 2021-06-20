import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-test-config',
  templateUrl: './test-config.component.html',
  styleUrls: ['./test-config.component.css']
})
export class TestConfigComponent implements OnInit {
  id: any;
  mockTest = [] as any;

  public cform = new FormGroup({
    duration: new FormControl('', Validators['required']),
    level: new FormControl('', Validators['required'])
  })

  public instructions: any;

  public isloading = true;
  public loadingtest = false;
  public startBtn = false;
  public qArray = [] as any;

  constructor(
    private route: ActivatedRoute,
    private db: AngularFirestore,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => { this.id = params.id });

    this.db.collection('mock_tests').ref.where('slug', '==', this.id).get().then((resp) => {
      resp.docs.forEach((data => {
        const test = data.data();
        this.mockTest.push(test)
      }))
      console.log(this.mockTest)
      this.instructions = this.mockTest[0].instructions;
      localStorage.setItem('instructions', this.instructions)

      this.isloading = false;
    })
  }

  back() {
    this.cform.reset();
    this.loadingtest = false;
    this.startBtn = false;
    this.qArray = [];
    localStorage.clear();
  }

  next() {
    console.log(this.cform.value);
    if (this.cform.invalid) {
      alert('Pls chosse duration and level both');
      return
    }
    else {

      this.loadingtest = true;
      this.db.collection('questions').ref.where('mock_test', 'array-contains', this.id).get().then((resp) => {
        let qno = 1;
        resp.docs.forEach((data => {
          const question = data.data() as any;
          // delete question.correct_option;
          const qObj = Object.assign({}, question, { ['qno']: qno, ['id']: data.id, ['for_review']: false, ['answer']: null })

          if (this.cform.value.level == question.level) {
            this.qArray.push(qObj)
            qno++;
          }
        }))
        console.log(this.qArray)
        if (this.qArray.length > 0) {
          localStorage.setItem('duration', this.cform.value.duration);
          localStorage.setItem('qArray', JSON.stringify(this.qArray));
          localStorage.setItem('test_name', this.mockTest[0].test_name);
          localStorage.setItem('pvm',this.mockTest[0].postive_mark);
          localStorage.setItem('nvm',this.mockTest[0].negetive_mark);
          this.startBtn = true;
          // console.log(JSON.parse(localStorage.getItem('qArray') || "[]"));
        } else {
          alert('Pls chosse other combinations or contact admin');
          this.loadingtest = false;

        }
      }).catch((err) => {
        console.log(err);
        alert('Something wrong. Try after some time or report to admin')
      })

    }
  }

  start() {
    this.router.navigate(['/test/exam']);
  }

}
