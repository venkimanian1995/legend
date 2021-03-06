import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {ValidateService} from '../services/validate.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: String;
  password: String;
  errorMessage: String = "";
  validateMessage: String = "";

  constructor(
    private authService: AuthService,
    private validateService: ValidateService, 
    private router: Router
  ) { }


  ngOnInit() {
  }

  onLoginSubmit(){
    const user = {
      username: this.username,
      password: this.password
    }

    //Will not work if either username or password field is blank.
    if(!this.validateService.validateRegister(user)) {
      this.validateMessage = "Please fill in all fields";
      setTimeout(() => {
        this.validateMessage = "";
        return false;
      }, 2000);
    }
    else {
      this.authService.authenticateUser(user).subscribe(data => {
        if (data.success) {
          this.authService.storeUserData(data.token, data.user);
          console.log(data.user);
          //Load info for drop-down menus into local storage
          this.onConfigSections();
          this.onConfigEditors();
          this.onConfigOnline();
          this.onConfigCodes();
          this.onLoadConfigFile();
          this.onGoRecentPage();
        } 
        else {
          this.errorMessage = data.msg;
          this.username ="";
          this.password ="";
          setTimeout(() => {
            this.errorMessage = "";
            this.router.navigate(['/login']);
          }, 2000);
        }
      });
    }
  }

 //Load sections for dropdown menus from section collection into an array, 
 //store into array and save in local memory.
  onConfigSections() {
    this.authService.getSections('section').subscribe(entries => {
      let sectionArr = entries;
      let sectionArrUnique = entries.filter(entry => !entry.layout && !entry.ETOCOnly && !entry.department); 
      let departmentArr = entries.filter(entry => 
        (entry.department) && (entry.department != "" || null || undefined)); 
      this.authService.localStoreSections(sectionArr);
      this.authService.localStoreUniqueSections(sectionArrUnique);
      this.authService.localStoreDepartments(departmentArr);
    }, 
    err => {
      console.log(err);
      return false;
    }); 
  }
  
  //Load names of editors for drop-down menus and store in local storage.
  onConfigEditors() {
    this.authService.getEditors().subscribe(entries => {
      let editorsArr = entries;
      this.authService.localStoreEditors(editorsArr);
    }, 
    err => {
      console.log(err);
      return false;
    }); 
  }
  
  //Load online issues and store in local memory. Only these dates will be clickable in calendar for 
  //selecting an online issue in the calendar.
  onConfigOnline() {
    this.authService.getOnline().subscribe(entries => {
      let onlineArr = entries;
      this.authService.localStoreOnline(onlineArr);
    }, 
    err => {
      console.log(err);
      return false;
    }); 
  }

  //Load the HighWire codes and store in local memory. 
  onConfigCodes() {
    this.authService.getCodes().subscribe(entries => {
      let codeArr = entries;
      this.authService.localStoreCodes(codeArr);
    }, 
    err => {
      console.log(err);
      return false;
    }); 
  }

  //Load the configuration file and store in local memory.
  onLoadConfigFile() {
    let configFile = {};
    this.authService.getConfig().subscribe(entries => {
      configFile = entries[0];
      this.authService.localStoreConfigFile(configFile);
     
    }, 
    err => {
        console.log(err);
        return false;
    });
  }

  //Will go to admin page if username is admin, or will go to search page for all other users.
  onGoRecentPage() {
    if(this.username.toLowerCase() == "admin") 
      this.router.navigate(['/register']);
    else
      this.router.navigate(['/recent']);
  }

}
