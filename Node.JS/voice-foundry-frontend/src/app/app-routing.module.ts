import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { InstructionsComponent } from './instructions/instructions.component';


const routes: Routes = [
  { path: 'instructions', component: InstructionsComponent},
  { path: 'about', component: AboutComponent },
  { path: '**', component: HomeComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
