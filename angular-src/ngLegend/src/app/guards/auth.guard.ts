import {Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  //Guard routes so that only logged-in users can access them.
  canActivate() {
	if(this.authService.loggedIn()){
	  return true;
    } else {
 	  this.router.navigate(['/login']);
	  return false;
	}
  }

}