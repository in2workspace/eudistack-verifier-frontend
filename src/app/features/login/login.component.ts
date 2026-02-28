import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { QRCodeComponent } from 'angularx-qrcode';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription, timer } from 'rxjs';
import { SseService } from '../../core/services/sse.service';
import { ThemeService } from '../../core/services/theme.service';
import { Theme } from '../../core/models/theme.model';

const LOGIN_TIMEOUT_MS = 120_000;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, QRCodeComponent, TranslateModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  authRequest = '';
  state = '';
  homeUri = '';
  theme: Theme | null = null;
  timedOut = false;
  errorMessage = '';
  sameDevice = false;

  private sseSub?: Subscription;
  private timerSub?: Subscription;
  private themeSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private sseService: SseService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.authRequest = this.route.snapshot.queryParamMap.get('authRequest') ?? '';
    this.state = this.route.snapshot.queryParamMap.get('state') ?? '';
    this.homeUri = this.route.snapshot.queryParamMap.get('homeUri') ?? '';

    this.themeSub = this.themeService.getTheme().subscribe(t => this.theme = t);

    if (this.state) {
      this.sseSub = this.sseService.connect(this.state).subscribe({
        next: redirectUrl => {
          window.location.href = redirectUrl;
        },
        error: () => {
          this.errorMessage = 'login.error';
        }
      });

      this.timerSub = timer(LOGIN_TIMEOUT_MS).subscribe(() => {
        this.timedOut = true;
        this.sseSub?.unsubscribe();
        if (this.homeUri) {
          window.location.href = this.homeUri;
        }
      });
    }
  }

  get deeplinkUrl(): string {
    if (!this.authRequest) return '';
    return this.authRequest.replace(/^https?:\/\//, 'openid4vp://');
  }

  navigateHome(): void {
    if (this.homeUri) {
      window.location.href = this.homeUri;
    }
  }

  navigateOnboarding(): void {
    if (this.theme?.content?.onboardingUrl) {
      window.location.href = this.theme.content.onboardingUrl;
    }
  }

  openWallet(): void {
    if (this.deeplinkUrl) {
      window.location.href = this.deeplinkUrl;
    }
  }

  ngOnDestroy(): void {
    this.sseSub?.unsubscribe();
    this.timerSub?.unsubscribe();
    this.themeSub?.unsubscribe();
  }
}
