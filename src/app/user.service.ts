import { Injectable } from '@angular/core';

@Injectable()
export class UserService {

  activeUsers= ['max', 'anna'];
  inactiveUsers= ['schris', 'manu']

  constructor() { }

  setToActive(id:number){
    this.activeUsers.push(this.inactiveUsers[id]);
    this.inactiveUsers.splice(id,1);
  }

  setToInactive(id:number){
    this.inactiveUsers.push(this.activeUsers[id]);
    this.activeUsers.splice(id, 1)
  }

}