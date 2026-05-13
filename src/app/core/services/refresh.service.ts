import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RefreshService {
  private http = inject(HttpClient);

  refreshAuthRequest(state: string): Observable<{ authRequest: string }> {
    const params = new HttpParams().set('state', state);

    return this.http.post<{ authRequest: string }>(
      `${environment.api_base_url}/api/login/refresh`,
      null,
      { params }
    );
  }
}
