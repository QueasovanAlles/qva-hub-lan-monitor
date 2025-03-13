import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import { QvaConnectionTopologyVisualizerModule } from 'qva-connection-topology-visualizer';
import { ClientComponent } from './client/client.component';

@NgModule({
  declarations: [
    AppComponent,
    ClientComponent
  ],
  imports: [
    BrowserModule, 
    FormsModule,
    BrowserAnimationsModule,
    QvaConnectionTopologyVisualizerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
