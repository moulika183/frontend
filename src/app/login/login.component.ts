import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule]
})
export class LoginComponent implements OnInit {
  accessToken = '';
  emailToSend = '';
  showEmailModal = false;
  isSending = false;
  showMainContent = false;

  constructor(
    private msalService: MsalService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.msalService.instance.handleRedirectPromise().then(result => {
      if (result !== null && result.account) {
        this.msalService.instance.setActiveAccount(result.account);
        this.afterLogin();
      } else {
        const account = this.msalService.instance.getActiveAccount() ||
                        this.msalService.instance.getAllAccounts()[0];

        if (account) {
          this.msalService.instance.setActiveAccount(account);
          this.afterLogin();
        } else {
          this.login(); // Trigger Azure AD login
        }
      }
    }).catch(error => {
      console.error('❌ Redirect handling failed:', error);
    });
  }

  login(): void {
    console.log('🔐 Redirecting to Azure AD login...');
    this.msalService.loginRedirect();
  }

  afterLogin(): void {
    const account = this.msalService.instance.getActiveAccount();
    if (!account) {
      console.error('❌ No active account found after login.');
      return;
    }

    this.msalService.instance.acquireTokenSilent({
      account: account,
      scopes: ['api://56a2df4c-2b80-43bd-b1a1-3fbbc09f629c/.default']
    }).then(result => {
      this.accessToken = result.accessToken;

      // ✅ Step 1: Show login success
      alert('✅ Successfully logged in with Azure AD.');

      // ✅ Step 2: Show modal to enter Email B
      this.showEmailModal = true;
    }).catch(error => {
      console.error('❌ Failed to acquire token:', error);
    });
  }

  sendEmailToQueue(): void {
    if (!this.emailToSend.trim()) {
      alert('⚠️ Please enter a valid email.');
      return;
    }

    const url = 'https://localhost:7064/api/QueueSender';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.accessToken}`
    });

    const body = { email: this.emailToSend.trim() };
    this.isSending = true;

    this.http.post(url, body, { headers }).subscribe({
      next: () => {
        alert(`📩 Email queued to: ${this.emailToSend}`);
        this.showEmailModal = false;
        this.showMainContent = true;
        this.emailToSend = '';
        this.isSending = false;
      },
      error: err => {
        console.error('❌ Error pushing to queue:', err);
        alert('❌ Failed to send email.');
        this.isSending = false;
      }
    });
  }
}
