import {Component, OnInit} from '@angular/core';
import {Employee} from "./employee";
import {EmployeeService} from "./employee.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // title!: string; // kad necrushintu appsas (veliau pasiziureti ar nepakeis sio fieldo)
  public employees!: Employee[];

  constructor(private employeeService: EmployeeService) {
  }

  // overrides OnInit's interface's ngOnInit() method;
  // when AppComponent is initialized, then it's going to call this method
  // and in turn, ngOnInit will call the getEmployees() method
  ngOnInit() {
    this.getEmployees();
  }

  // kai kurios .subscribe() implementacijos yra deprecated
  // pabandyti veliau isimti error dali ir patikrinti ar kodas veiks taip pat
  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (response: Employee[]) => {
        this.employees = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }


  public onOpenModal(employee: Employee, mode: string): void {  // 'mode' parameter tells exactly what the user wants to do
    const container = document.getElementById('main-container'); // gives access to the 'main-container' <div> element in app.component.html
    const button = document.createElement('button');
    button.type = 'button';                                     // changes the button type from 'submit' to 'button'
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addEmployeeModal');
    }
    if (mode === 'edit') {
      button.setAttribute('data-target', '#editEmployeeModal');
    }
    if (mode === 'delete') {
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }
    container!.appendChild(button); // added '!' to remove object is possibly null error
    button.click();
  }

}

