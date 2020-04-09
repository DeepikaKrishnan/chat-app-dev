import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';
import { ContactsComponent } from './components/contacts/contacts.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: "full" },
  { path: 'login', component: LoginComponent },
  { path: 'contacts', component: ContactsComponent},
  { path: 'chat/:id', component: ChatRoomComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
