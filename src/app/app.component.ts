import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor() {}

  numbers = from([1, 2, 3, 4, 5]);

  ngOnInit() {
    this.numbers
      .pipe(
        map(function (x) {
          return x * 2;
        })
      )
      .subscribe((data) => {
        console.log(data);
      });
  }
}
