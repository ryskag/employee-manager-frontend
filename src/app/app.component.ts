import {Component, OnInit} from '@angular/core';
import {Employee} from "./employee";
import {EmployeeService} from "./employee.service";
import {HttpErrorResponse} from "@angular/common/http";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title!: string;
  public employees: Employee[];
  public editEmployee: Employee | undefined;
  public deleteEmployee: Employee | undefined;

  constructor(private employeeService: EmployeeService) {
    this.employees = [];
  }

  // overrides OnInit's interface's ngOnInit() method;
  // when AppComponent is initialized, then it's going to call this method
  // and in turn, ngOnInit will call the getEmployees() method
  ngOnInit() {
    this.getEmployees();
  }

  // some of the .subscribe() implementations are deprecated
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

  // value on the form will be a json representation of all the inputs:
  public onAddEmployee(addForm: NgForm): void {
    //@ts-ignore
    document.getElementById('add-employee-form').click();
    this.employeeService.addEmployee(addForm.value).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
        addForm.reset();                // clears the form
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();                // clears the form
      }
    );
  }

  public onUpdateEmployee(employee: Employee): void {
    this.employeeService.updateEmployee(employee).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onDeleteEmployee(employeeId: number): void {
    this.employeeService.deleteEmployee(employeeId).subscribe(
      (response: void) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public searchEmployees(key: string): void {
    const results: Employee[] = [];
    for (const employee of this.employees) {
      if (employee.name.toLocaleLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.email.toLocaleLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.phone.toLocaleLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.jobTitle.toLocaleLowerCase().indexOf(key.toLowerCase()) !== -1) {
        results.push(employee);
      }
    }
    this.employees = results;
    if (results.length === 0 || !key) {
      this.getEmployees();
    }
  }

  public onOpenModal(mode: string, employee?: Employee): void {           // 'mode' parameter tells exactly what the user wants to do
    const container = document.getElementById('main-container'); // gives access to the 'main-container' <div> element in app.component.html
    const button = document.createElement('button');
    button.type = 'button';                                               // changes the button type from 'submit' to 'button'
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addEmployeeModal');
    }
    if (mode === 'edit') {
      this.editEmployee = employee;
      button.setAttribute('data-target', '#editEmployeeModal');
    }
    if (mode === 'delete') {
      this.deleteEmployee = employee;
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }
    // @ts-ignore
    container.appendChild(button);
    button.click();
  }
}
