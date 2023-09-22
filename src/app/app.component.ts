import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Component } from '@angular/core';
import {
  combineLatest,
  forkJoin,
  from,
  interval,
  of,
  Subscription,
  timer,
  concat,
} from 'rxjs';
import { catchError, filter, first, map, take } from 'rxjs/operators';

export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private http: HttpClient) {}

  observable = of(1, 2, 3, 4);
  observable1 = of([1, 2, 3, 4]);

  numbers = from([1, 2, 3, 4]);
  numbers1 = from([
    { name: 'bittu', city: 'blr' },
    { name: 'bittu', city: 'blr' },
  ]);
  numbers2 = from('hello');
  numbers3 = from(new Promise((resolve, reject) => resolve('hello')));
  numbers4 = from(fetch('https://jsonplaceholder.typicode.com/users/1'));
  source = interval(1000);
  subscribe: Subscription;
  takeFourNumber: Subscription;
  response = [];
  todos: number[] = [1, 3, 5, 7, 9];
  viewValues: Todo[];
  showError = false;
  combinedValues: any[] = [];
  combinedLatestSingleValues: any[] = [];
  forkJoinValues: any[] = [];

  ngOnInit() {
    // of
    this.observable.subscribe((data) => {
      console.log('of', data);
    });
    // 1 2 3 4

    this.observable1.subscribe((data) => {
      console.log(data);
    });
    // [1,2,3,4]

    // from
    this.numbers.subscribe((data) => {
      console.log('from', data);
    });

    this.numbers1.subscribe((data) => {
      console.log('from', data);
    });

    this.numbers2.subscribe((data) => {
      console.log(data);
    });

    this.numbers3.subscribe((data) => {
      console.log(data);
    });

    this.numbers4.subscribe((data) => {
      let numbers5 = from(data.json());
      numbers5.subscribe((data) => {
        console.log(data);
      });
    });

    //pipe, map and filter

    this.numbers
      .pipe(
        map(function (x) {
          return x * 2;
        }),
        filter(function (x) {
          return x > 2;
        })
      )
      .subscribe((data) => {
        console.log('pipe- map, filter operators', data);
      });

    this.observable
      .pipe(
        map(function (value) {
          return value * 2;
        })
      )
      .subscribe((data) => {
        console.log('map in number', data);
      });

    this.observable1
      .pipe(
        map(function (array) {
          return array.map((value) => value * 2);
        })
      )
      .subscribe((data) => {
        console.log('map in array', data);
      });

    this.observable.pipe(filter((value) => value > 2)).subscribe((data) => {
      console.log('filter data in number', data);
    });

    this.numbers.pipe(filter((value) => value > 2)).subscribe((data) => {
      console.log('filter data in numbers', data);
    });

    //first
    this.observable.pipe(first()).subscribe((data) => {
      console.log('first operator', data);
    });

    this.observable1.pipe(first()).subscribe((data) => {
      console.log('first operator', data);
    });

    //interval
    // -- uncomment below line and observe output
    // this.subscribe = this.source.subscribe((val) => console.log(val));

    //take
    this.takeFourNumber = this.source.pipe(take(4)).subscribe((data) => {
      console.log(data);
    });

    // forkJoin

    const request1 = this.http.get(
      'https://jsonplaceholder.typicode.com/users/1'
    );
    const request2 = this.http.get(
      'https://jsonplaceholder.typicode.com/users/2'
    );
    const request3 = this.http.get(
      'https://jsonplaceholder.typicode.com/users/3'
    );
    const request4 = this.http.get(
      'https://jsonplaceholder.typicode.com/users/4'
    );

    forkJoin([request1, request2, request3, request4]).subscribe(
      (data) => {
        this.response = data;
        console.log('cc', this.response);
      },
      (error) => {
        console.error('Error:', error);
      }
    );

    forkJoin([request1, request2, request3]).subscribe(
      ([result1, result2, result3]) => {
        console.log('Result 1:', result1);
        console.log('Result 2:', result2);
        console.log('Result 3:', result3);
      },
      (error) => {
        console.error('Error:', error);
      }
    );

    this.getTodos();

    //combine latest
    //timerOne emits first value at 6s, then once every 4s
    const timer1 = timer(6000, 4000).pipe(take(4));
    //timerTwo emits first value at 5s, then once every 4s
    const timer2 = timer(5000, 4000).pipe(take(5));
    //timerThree emits first value at 7s, then once every 4s
    const timer3 = timer(7000, 4000).pipe(take(3));

    //when one timer emits, emit the latest values from each timer as an array
    combineLatest([timer1, timer2, timer3]).subscribe(
      ([timerValOne, timerValTwo, timerValThree]) => {
        this.combinedLatestSingleValues = [
          timerValOne,
          timerValTwo,
          timerValThree,
        ];
        console.log('latest value', this.combinedLatestSingleValues);
      }
    );

    combineLatest([timer1, timer2, timer3]).subscribe((val) => {
      this.combinedValues.push(val);
    });

    forkJoin([timer1, timer2, timer3]).subscribe((val) => {
      this.forkJoinValues.push(val);
    });

    // concat
    const timer12 = interval(1000).pipe(take(10));
    const timer13 = interval(2000).pipe(take(6));
    const timer14 = interval(500).pipe(take(10));

    const result = concat(timer12, timer13, timer14);
    result.subscribe((x) => {
      console.log('concat', x);
    });

    const sourceA$ = of(1, 2, 3);
    const sourceB$ = of(4, 5, 6);
    const sourceC$ = of(7, 8, 9);
    const source$ = concat(sourceA$, sourceB$, sourceC$);

    source$.subscribe((data) => console.log(data));

    // mergeMap
  }

  ngOnDestroy() {
    this.subscribe.unsubscribe();
  }

  getTodos() {
    // try to make url wrong and observe the html output
    // you can use *ngIf in html and based on the showError condition-
    // and you can use err object or any other object for default value inside of operator to display UI
    const todos = this.todos.map((t) =>
      this.http.get<Todo>(`https://jsonplaceholder.typicode.com/todos/${t}`)
    );
    forkJoin(todos)
      .pipe(
        catchError((err) => {
          console.log('err', err);
          this.showError = true;
          return of(err);
        })
      )
      .subscribe((resp) => (this.viewValues = resp));
  }
}
