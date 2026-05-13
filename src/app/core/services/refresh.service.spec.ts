import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { RefreshService } from './refresh.service';
import { environment } from '../../../environments/environment';

describe('RefreshService', () => {
  let service: RefreshService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RefreshService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(RefreshService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  describe('refreshAuthRequest', () => {
    it('should call the correct URL with state as a query parameter', () => {
      service.refreshAuthRequest('test-state').subscribe();

      const req = httpTesting.expectOne(
        `${environment.api_base_url}/api/login/refresh?state=test-state`
      );
      expect(req.request.method).toBe('POST');
      req.flush({ authRequest: 'new-auth-request' });
    });

    it('should encode special characters in state', () => {
      service.refreshAuthRequest('state with spaces&special=chars').subscribe();

      const req = httpTesting.expectOne(
        `${environment.api_base_url}/api/login/refresh?state=state%20with%20spaces%26special=chars`
      );
      req.flush({ authRequest: 'new-auth-request' });
    });

    it('should return the authRequest from the response', () => {
      const mockResponse = { authRequest: 'openid://new-request-uri' };

      let result: { authRequest: string } | undefined;
      service.refreshAuthRequest('test-state').subscribe(res => (result = res));

      httpTesting.expectOne(`${environment.api_base_url}/api/login/refresh?state=test-state`)
        .flush(mockResponse);

      expect(result).toEqual(mockResponse);
    });

    it('should propagate HTTP errors', () => {
      let receivedError: unknown;
      service.refreshAuthRequest('test-state').subscribe({
        error: err => (receivedError = err)
      });

      httpTesting.expectOne(`${environment.api_base_url}/api/login/refresh?state=test-state`)
        .flush('Server error', { status: 500, statusText: 'Internal Server Error' });

      expect(receivedError).toBeTruthy();
    });

    it('should return an Observable', () => {
      const result = service.refreshAuthRequest('test-state');
      expect(typeof result.subscribe).toBe('function');
    });
  });
});
