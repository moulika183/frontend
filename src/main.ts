// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { App } from './app/app';

bootstrapApplication(App, {
  providers: [
    importProvidersFrom(HttpClientModule, FormsModule)
  ]
}).catch(err => console.error(err));
