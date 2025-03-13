import { mergeApplicationConfig, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRouting } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { LucideAngularModule, ChevronRight, ChevronLeft } from 'lucide-angular';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideServerRouting(serverRoutes),
    importProvidersFrom(LucideAngularModule.pick({ ChevronLeft, ChevronRight }))
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
