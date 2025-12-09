import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  back_adress = environment.apiUrl;
  constructor(private http: HttpClient) {}

  verifyToken(): Observable<boolean> {
    return this.http
      .post<{ valid: boolean }>(
        this.back_adress + 'auth/verify',
        {},
        {
          withCredentials: true,
        }
      )
      .pipe(
        map((res) => res.valid),
        catchError(() => of(false))
      );
  }
}
