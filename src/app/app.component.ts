import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Component } from '@angular/core';
import { forkJoin, from, interval, of, Subscription } from 'rxjs';
import { filter, first, map, take } from 'rxjs/operators';

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
        console.log(this.response);
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

    //combine latest

    // conat
  }

  ngOnDestroy() {
    this.subscribe.unsubscribe();
  }
}
