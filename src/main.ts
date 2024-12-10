import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { DashboardComponent } from './app/views/dashboard/dashboard.component';
import { provideRouter } from '@angular/router';

import { appConfig } from './app/app.config';



bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));


// bootstrapApplication(AppComponent, {
//   providers: [
//     provideHttpClient(),
//     provideRouter([
//       { path: '', component: DashboardComponent },
//       { path: 'dashboard', component: DashboardComponent },
//     ]),
//   ],
// }).catch((err) => {
//   console.error(err);
  
// }); 

// bootstrapApplication(AppComponent, {
//   providers: [
//     provideHttpClient(), 
//     provideRouter([
//       { path: '', component: DashboardComponent }, // Default route
//     ]),
   
//   ],
// }).catch((err) => console.error(err));

// bootstrapApplication(AppComponent, {
//   providers: [
//     ...appConfig.providers,
//     provideHttpClient(),
//     provideAnimations(), // Needed for Toastr and Spinner animations
//     {
//       provide: ToastrModule,
//       useValue: { timeOut: 3000, positionClass: 'toast-top-right' },
//     },
//     {
//       provide: NgxSpinnerModule,
//       useValue: { type: 'ball-scale-multiple' },
//     },
//   ],
// }).catch((err) => console.error(err));
