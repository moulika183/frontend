import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import {
  provideHttpClient,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS,
  HttpClientModule
} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { App } from './app/app';

import {
  MsalModule,
  MsalService,
  MSAL_INSTANCE,
  MSAL_GUARD_CONFIG,
  MSAL_INTERCEPTOR_CONFIG,
  MsalInterceptor
} from '@azure/msal-angular';

import {
  IPublicClientApplication,
  PublicClientApplication,
  InteractionType,
  AuthenticationResult
} from '@azure/msal-browser';

(async () => {
  const msalInstance: IPublicClientApplication = new PublicClientApplication({
    auth: {
      clientId: 'd96bd774-adfe-428c-a493-576054b6c7be', // ✅ Frontend app client ID
      authority: 'https://login.microsoftonline.com/b41b72d0-4e9f-4c26-8a69-f949f367c91d', // ✅ Azure tenant
      redirectUri: 'https://delightful-pebble-080d0581e.1.azurestaticapps.net'
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: false
    }
  });

  // ✅ Initialize MSAL instance
  await msalInstance.initialize();

  // ✅ Handle the redirect and print the token
  const response = await msalInstance.handleRedirectPromise();
  if (response) {
    console.log('✅ JWT Token:', response.accessToken);  // 👈 Print token here
  } else {
    const account = msalInstance.getAllAccounts()[0];
    if (account) {
      const tokenResp = await msalInstance.acquireTokenSilent({
        scopes: ['api://56a2df4c-2b80-43bd-b1a1-3fbbc09f629c/.default'],
        account: account
      });
      console.log('✅ JWT Token (Silent):', tokenResp.accessToken); // 👈 Token from cache
    }
  }

  // ✅ Bootstrap Angular app
  bootstrapApplication(App, {
    providers: [
      provideHttpClient(withInterceptorsFromDi()),
      importProvidersFrom(HttpClientModule, FormsModule, MsalModule),
      {
        provide: MSAL_INSTANCE,
        useValue: msalInstance
      },
      {
        provide: MSAL_GUARD_CONFIG,
        useValue: {
          interactionType: InteractionType.Redirect,
          authRequest: {
            scopes: ['api://56a2df4c-2b80-43bd-b1a1-3fbbc09f629c/.default']
          }
        }
      },
      {
        provide: MSAL_INTERCEPTOR_CONFIG,
        useValue: {
          interactionType: InteractionType.Redirect,
          protectedResourceMap: new Map([
            ['https://demoappservice-c7cjgvf6fdd4hpdv.westus-01.azurewebsites.net/api', ['api://56a2df4c-2b80-43bd-b1a1-3fbbc09f629c/.default']]
          ])
        }
      },
      MsalService,
      {
        provide: HTTP_INTERCEPTORS,
        useClass: MsalInterceptor,
        multi: true
      }
    ]
  }).catch(err => console.error(err));
})();
