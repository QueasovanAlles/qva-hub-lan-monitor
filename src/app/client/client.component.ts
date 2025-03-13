import { Component, Input, OnInit, HostListener } from '@angular/core';
import { WSClient } from '../qvahub-lan-client.service';
import { InOut } from 'qva-connection-topology-visualizer';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {

  @Input() device!: any;

  InOut = InOut;

  constructor() {}

  ngOnInit(): void {
   
  }

    @HostListener('document:mousemove', ['$event'])
	onMouseMove(event: MouseEvent) {
	
		  
	}
}


