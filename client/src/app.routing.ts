import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Home }     from './app/home/home';
import { Settings } from './app/settings/settings';
import { Bonus }    from './app/bonus/bonus';

export const ROUTES: Routes = [
  { path: ''        , component: Home },
  { path: 'settings', component: Settings },
  { path: 'bonus'   , component: Bonus }
];

export const ROUTING: ModuleWithProviders = RouterModule.forRoot(ROUTES);
