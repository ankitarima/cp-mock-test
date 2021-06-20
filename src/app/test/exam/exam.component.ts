import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import firebase from 'firebase';



@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ExamComponent implements OnInit {

  qform = new FormGroup({
    answer: new FormControl(null),
  });

  public test_name: any;
  public slug: any;
  public isResult = false;
  public isresultloading = true as any;
  private uid:any

  public duration: any;
  public qarray = [] as any;

  public totalQestions: any
  public mathsQs = 0;
  public physicsQs = 0;
  public chemistryQs = 0;
  public instructions: any;
  public counter = 0;
  public answerObj: any

  public ismaths = false;

  public result = {} as any;




  constructor(
    private db: AngularFirestore,
    private router: Router,
    private afAuth: AngularFireAuth,
  ) {
  }

  ngOnInit(): void {
    var time = localStorage.getItem('duration')?.split(':')[0] as any;
    this.instructions = localStorage.getItem('instructions');
    this.test_name = localStorage.getItem('test_name');
    this.slug = localStorage.getItem('test_slug');
    // console.log(time)



    this.db.collection('questions').ref.where('mock_test', 'array-contains', this.slug).get().then((resp)=>{
        let qno = 1;
        resp.docs.forEach((data) => {
          const question = data.data() as any;
          // delete question.correct_option;
          const qObj = Object.assign({}, question, { ['qno']: qno, ['id']: data.id, ['for_review']: false, ['answer']: null })

          this.qarray.push(qObj)
            qno++;
      })

    }).then(()=>{
      this.duration = { leftTime: time * 60 }
    })


    this.qarray = JSON.parse(localStorage.getItem('qArray') || "[]");
    console.log(this.qarray);
    this.totalQestions = this.qarray.length;

    this.afAuth.user.subscribe((resp=>{
      this.uid = resp?.uid
    })),

    // To get the no subject wise questions
    this.mathsQs = this.qarray.filter((val:any)=>{
      if(val.subject === 'maths'){
        return val
      }
    }).length

    this.physicsQs = this.qarray.filter((val:any)=>{
      if(val.subject === 'physics'){
        return val
      }
    }).length

    this.chemistryQs = this.qarray.filter((val:any)=>{
      if(val.subject === 'chemistry'){
        return val
      }
    }).length

  }


  exit() {
    const arr = Array.from(Object.keys(this.result), k=>[this.result[k]]);
    console.log(arr.length)

    if (arr.length != 0) {
      localStorage.removeItem('qArray');
      localStorage.removeItem('duration');
      localStorage.removeItem('qArray');
      this.router.navigate(['/']);
    } else {
      const exit = confirm('Are you sure to exit test and go to home page');
      if (exit) {
        localStorage.removeItem('qArray');
        localStorage.removeItem('duration');
        localStorage.removeItem('qArray');
        this.router.navigate(['/']);
      } else {
        return;
      }
    }

  }

  onTimesUp(event: any) {
    if (event.action === 'done') {
      alert('Time UP! test will submit automatically, wait for the results');
      this.submit();
    }
  }

  next(qno: any) {
    // console.log('in next', qno);
    if (this.counter < this.totalQestions) {
      if (qno == this.totalQestions) {
        this.qform.reset();
        this.answerMarker(qno);
      } else {
        this.qform.reset();
        this.answerMarker(qno + 1);
      }

    }
    if (this.counter < this.totalQestions - 1) {

      this.counter++;
    }
  }

  previous(qno: any) {
    // console.log('in previous');
    if (this.counter == 0) {
      return
    }

    if (this.counter >= 0) {
      this.qform.reset();
      this.answerMarker(qno - 1);
      this.counter--;
    }

  }

  review(qno: any) {
    if(this.qarray[qno - 1].for_review == true){
      this.qarray[qno - 1].for_review = false;
    }else{
      this.qarray[qno - 1].for_review = true
    }
    // console.log(this.qarray);

  }
  clear(qno: any) {
    this.qarray[qno - 1].answer = null;
    this.answerObj = null;
    this.qform.reset();
    // console.log(this.qarray);

  }

  navigateTo(to: any) {
    // console.log(to + 1)
    this.counter = to;
    this.qform.reset();
    this.answerMarker(to + 1);

  }

  changeOption(event: any, qno: any, qid: any) {
    this.answerObj = { ['qno']: qno, ['qid']: qid, ['answer']: event.target.value }
    // console.log(this.answerObj );
    this.answerArrayBuilder(qno);
  }

  answerMarker(qno: any) {
    // console.log('in answer marker, '+qno)
    if (qno == this.qarray[qno - 1].qno) {
      this.qform.setValue({ 'answer': this.qarray[qno - 1].answer });
    } else {
      this.qform.reset();
    }
  }

  answerArrayBuilder(qno: any) {
    // console.log(qno);
    if (this.answerObj) {
      if (this.qarray.length > 0) {
        this.qarray[qno - 1].answer = this.answerObj.answer;
        this.answerObj = null;
        // localStorage.setItem('qArray', JSON.stringify(this.qarray));
      }
    }

    // console.log(this.qarray);
  }

  submit() {
    this.isResult = true;
    if(this.slug.split('-')[0] === 'wbjee'){
      const unique = [...new Set(this.qarray.map((item: { subject: any; }) => item.subject))] as any;
      if(unique[0] === 'maths'){
        this.ismaths = true;
        const answeredArray = this.qarray.filter((val:any)=>{
          if(val.answer != null){
            return val
          }
        })
        const wrongAnswers = answeredArray.filter((val: any)=>{
          if(val.answer !== val.correct_option){
            return val
          }
        })

        // Main result array
        const resultArray = answeredArray.filter((val:any)=>{
          if(val.answer === val.correct_option){
            return val
          }
        })

        let section1c = 0;
        resultArray.forEach((element: any) => {
          if(element.section == 1){
            section1c = section1c + element.postive_mark
          }
        });

        let section2c = 0;
        resultArray.forEach((element: any) => {
          if(element.section == 2){
            section2c = section2c + element.postive_mark
          }
        });

        let section3c = 0;
        resultArray.forEach((element: any) => {
          if(element.section == 3){
            section3c = section3c + element.postive_mark
          }
        });

        let section1n = 0;
        wrongAnswers.forEach((element: any) => {
          if(element.section == 1){
            section1n = section1n + element.negetive_mark
          }
        });

        let section2n = 0;
        wrongAnswers.forEach((element: any) => {
          if(element.section == 2){
            section2n = section2n + element.negetive_mark
          }
        });

        let section3n = 0;
        wrongAnswers.forEach((element: any) => {
          if(element.section == 3){
            section3n = section3n + element.negetive_mark
          }
        });

        const section1s = section1c - section1n;
        const section2s = section2c - section2n;
        const section3s = section3c - section3n;

        const totalScore = section3s+section2s+section1s;

        const percentageScore = Math.ceil((totalScore/100*100));

        this.result = Object.assign({},{
          ['percentageScore']: percentageScore,
          [unique[0]]: Object.assign({},{
            ['section1c']: section1c,
            ['section2c']: section2c,
            ['section3c']: section3c,
            ['section1n']: section1n,
            ['section2n']: section2n,
            ['section3n']: section3n,
            ['section1s']: section1s,
            ['section2s']: section2s,
            ['section3s']: section3s,
            ['totalScore']: totalScore,

          })
        });



        console.log(this.result);
        this.db.collection('mock_results').add({
          uid: this.uid,
          test_name: this.test_name,
          test_slug: this.slug,
          result: this.result,
          created_at: firebase.firestore.FieldValue.serverTimestamp()
        }).then(()=>{
          this.isresultloading = false;
        })


      }else{

        const answeredArray = this.qarray.filter((val:any)=>{
          if(val.answer != null){
            return val
          }
        })
        const wrongAnswers = answeredArray.filter((val: any)=>{
          if(val.answer !== val.correct_option){
            return val
          }
        })

        // Main result array
        const resultArray = answeredArray.filter((val:any)=>{
          if(val.answer === val.correct_option){
            return val
          }
        })

        const physicsCorrectArray = resultArray.filter((val:any)=>{
          if(val.subject === 'physics'){
            return val
          }
        })

        const chemistryCorrectArray = resultArray.filter((val:any)=>{
          if(val.subject === 'chemistry'){
            return val
          }
        })

        const physicsIncorrectArray = wrongAnswers.filter((val:any)=>{
          if(val.subject === 'physics'){
            return val
          }
        })

        const chemistryIncorrectArray = wrongAnswers.filter((val:any)=>{
          if(val.subject === 'chemistry'){
            return val
          }
        })

        // For Physics
        let section1pc = 0;
        let section2pc = 0;
        let section3pc = 0;
        physicsCorrectArray.forEach((element: any) => {
          if(element.section == 1){
            section1pc = section1pc + element.postive_mark
          }else if(element.section == 2){
            section2pc = section2pc + element.postive_mark
          }else if(element.section == 3){
            section3pc = section3pc + element.postive_mark
          }
        });

        let section1pn = 0;
        let section2pn = 0;
        let section3pn = 0;
        physicsIncorrectArray.forEach((element: any) => {
          if(element.section == 1){
            section1pn = section1pn + element.negetive_mark
          }else if(element.section == 2){
            section2pn = section2pn + element.negetive_mark
          }else if(element.section == 3){
            section3pn = section3pn + element.negetive_mark
          }
        });

         // For Chemistry
        let section1cc = 0;
        let section2cc = 0;
        let section3cc = 0;
        chemistryCorrectArray.forEach((element: any) => {
          if(element.section == 1){
            section1cc = section1cc + element.postive_mark
          }else if(element.section == 2){
            section2cc = section2cc + element.postive_mark
          }else if(element.section == 3){
            section3cc = section3cc + element.postive_mark
          }
        });


        let section1cn = 0;
        let section2cn = 0;
        let section3cn = 0;
        chemistryIncorrectArray.forEach((element: any) => {
          if(element.section == 1){
            section1cn = section1cn + element.negetive_mark
          }else if(element.section == 2){
            section2cn = section2cn + element.negetive_mark
          }else if(element.section == 3){
            section3cn = section3cn + element.negetive_mark
          }
        });

        const section1ps = section1pc - section1pn;
        const section2ps = section2pc - section2pn;
        const section3ps = section3pc - section3pn;

        const totalScoreP = section3ps+section2ps+section1ps;

        const section1cs = section1cc - section1cn;
        const section2cs = section2cc - section2cn;
        const section3cs = section3cc - section3cn;

        const totalScoreC = section1cs+section2cs+section3cs;

        const percentageScore = Math.ceil(((totalScoreC+totalScoreP)/ 100*100));

        this.result = Object.assign({},{
          ['percentageScore']: percentageScore,
          ['physics']: Object.assign({},{
            ['section1pc']: section1pc,
            ['section2pc']: section2pc,
            ['section3pc']: section3pc,
            ['section1pn']: section1pn,
            ['section2pn']: section2pn,
            ['section3pn']: section3pn,
            ['section1ps']: section1ps,
            ['section2ps']: section2ps,
            ['section3ps']: section3ps,
            ['totalScoreP']: totalScoreP,
          }),
          ['chemistry']: Object.assign({},{
            ['section1cc']: section1cc,
            ['section2cc']: section2cc,
            ['section3cc']: section3cc,
            ['section1cn']: section1cn,
            ['section2cn']: section2cn,
            ['section3cn']: section3cn,
            ['section1cs']: section1cs,
            ['section2cs']: section2cs,
            ['section3cs']: section3cs,
            ['totalScoreC']: totalScoreC,
          })
        });



        console.log(this.result);
        this.db.collection('mock_results').add({
          uid: this.uid,
          test_name: this.test_name,
          test_slug: this.slug,
          result: this.result,
          created_at: firebase.firestore.FieldValue.serverTimestamp()
        }).then(()=>{
          this.isresultloading = false;
        })

      }
    }else{

      const pvm = Number(localStorage.getItem('pvm'));
      const nvm = Number(localStorage.getItem('nvm'));

      const answeredArray = this.qarray.filter((val:any)=>{
        if(val.answer != null){
          return val
        }
      })

      const wrongAnswers = answeredArray.filter((val: any)=>{
        if(val.answer !== val.correct_option){
          return val
        }
      })

      // Main result array
      const resultArray = answeredArray.filter((val:any)=>{
        if(val.answer === val.correct_option){
          return val
        }
      });

      // Subject wise result
      const mathsCorrectArray = resultArray.filter((val:any)=>{
        if(val.subject === 'maths'){
          return val
        }
      })

      const physicsCorrectArray = resultArray.filter((val:any)=>{
        if(val.subject === 'physics'){
          return val
        }
      })

      const chemistryCorrectArray = resultArray.filter((val:any)=>{
        if(val.subject === 'chemistry'){
          return val
        }
      })

      // Subject Incorrect
      const mathsIncorrectArray = wrongAnswers.filter((val:any)=>{
        if(val.subject === 'maths'){
          return val
        }
      })

      const physicsIncorrectArray = wrongAnswers.filter((val:any)=>{
        if(val.subject === 'physics'){
          return val
        }
      })

      const chemistryIncorrectArray = wrongAnswers.filter((val:any)=>{
        if(val.subject === 'chemistry'){
          return val
        }
      })



      const negativeScore = wrongAnswers.length*nvm;
      const totalScore = Number(localStorage.getItem('total_marks'));
      const score = (resultArray.length*pvm) -(wrongAnswers.length*nvm);

      // converting to percentage to show in the result section
      const percentageScore = Math.ceil((score/totalScore*100));

      const mathsCorrectScore = mathsCorrectArray.length*pvm;
      const chemistryCorrectScore = chemistryCorrectArray.length*pvm;
      const physicsCorrectScore = physicsCorrectArray.length*pvm;

      const mathsIncorrectScore = mathsIncorrectArray.length*nvm;
      const chemistryIncorrectScore = chemistryIncorrectArray.length*nvm;
      const physicsIncorrectScore = physicsIncorrectArray.length*nvm;

      this.result = Object.assign({},{
        ['percentageScore']: percentageScore,
        ['totalScore']: totalScore,
        ['score']: score,
        ['negativeScore']: negativeScore,
        ['mathsCorrectScore']: mathsCorrectScore,
        ['chemistryCorrectScore']: chemistryCorrectScore,
        ['physicsCorrectScore']: physicsCorrectScore,
        ['mathsIncorrectScore']: mathsIncorrectScore,
        ['chemistryIncorrectScore']: chemistryIncorrectScore,
        ['physicsIncorrectScore']: physicsIncorrectScore
      });

      console.log(this.result);

      this.db.collection('mock_results').add({
        uid: this.uid,
        test_name: this.test_name,
        test_slug: this.slug,
        result: this.result,
        created_at: firebase.firestore.FieldValue.serverTimestamp()
      }).then(()=>{
        this.isresultloading = false;
      })

    }

  }

}
