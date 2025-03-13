import { Component, OnInit, ViewChild, ElementRef,AfterViewInit, ChangeDetectorRef, HostListener  } from '@angular/core';
import { QvahubLanClient, ConnectionStatus, WSClient } from './qvahub-lan-client.service';
import { QvahubLocalhost } from './qvahub-localhost.service';
import { QvaLoggerService} from './qva-logger.service';

import { AudioJackHoleComponent, InOut, ConnectionService, PositionUpdateService } from 'qva-connection-topology-visualizer';
import { fromEvent, Subscription, interval } from 'rxjs';
import { debounceTime, takeWhile } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    private eventSubscriptions: Subscription[] = [];
    private deviceUpdateSubscription: Subscription | null = null;

    @ViewChild('cableContainer') cableContainer: ElementRef | null = null;    

    title = 'QvAHub LAN - Monitor';
    
    connectionStatus = 'closed';
    wsClients: WSClient[] = [];

	clientDevices : any[]= [];
    cables: any[] = [];
    cablingConnection: any;
    InOut = InOut;

    private lastIncommingSignal: number = 0;

    constructor(
        private hubClient: QvahubLanClient,
        private localhost: QvahubLocalhost,
        private log: QvaLoggerService,
        private cdr: ChangeDetectorRef, 
        private connectionService: ConnectionService,
		private positionUpdateService : PositionUpdateService
    ) {
        this.log.setLogging(true);
        this.connectionService.cablesChanged.subscribe(updatedCables => {
            this.cables = updatedCables;
        });
    }

    ngAfterViewInit() {
        
    }

    ngOnInit() {
        this.log.setLogging(true);
        this.localhost.setFromLocation();
        
        this.hubClient.connectionEvents().subscribe((data: any) => {
            this.connectionStatus = data.status;
            if (this.connectionStatus === 'open')
                this.hubClient.send('start', {});
        });

        this.hubClient.messageEvents().subscribe((data: any) => {

            this.lastIncommingSignal = new Date().getTime();

            switch (data.type) {
                case 'clientConnected':
                case 'clientRegistered':
                case 'clientInfo':
                    this.addOrUpdateClient({
                        clientId: data.clientId,
                        webrtcType: data.webrtcType,
                        type: data.clientType,
                        name: data.clientName,
                        lastActivity: data.lastActivity,
                        lastMessage: data.lastSentMsg,
                        isConnected: true
                    });
                    break;
                case 'clientDisconnected': //deprecated
                case 'clientDeleted':
                    this.removeClient(data.clientId);
                    break;
                case 'webRTCConnection':
					this.registerConnection(data.peer, data.host);
                    break;
   
                default: console.log(`ERROR: unhandled WS Message '${data.type}'`);
            }
        });

        this.hubClient.connect(this.localhost.getIPv4(), this.localhost.getPort(), 'QvaHub Monitor', 'monitor');

        // Listen to common activity events and signal them to the service
        const events = ['mousemove', 'scroll', 'resize', 'click'];
        events.forEach((eventName) => {
          const sub = fromEvent(window, eventName)
            .pipe(debounceTime(100)) // Debounce to avoid excessive calls
            .subscribe(() => {
              this.positionUpdateService.signalActivity();
            });
          this.eventSubscriptions.push(sub);
        });

    }

    ngOnDestroy(): void {
        this.eventSubscriptions.forEach((sub) => sub.unsubscribe());
        if (this.deviceUpdateSubscription) {
            this.deviceUpdateSubscription.unsubscribe();
        }
    }

	registerConnection(peerId : string, hostId : string) {
		const peerDevice =  this.clientDevices[this.clientDevices.findIndex(c => c.clientId === peerId)];
		const hostDevice =  this.clientDevices[this.clientDevices.findIndex(c => c.clientId === hostId)];
		const peerHoleId = this.generateJackHoleId();
		const hostHoleId = this.generateJackHoleId();
		peerDevice.outputIds.push(peerHoleId);
		hostDevice.inputIds.push(hostHoleId);
		this.connectionService.registerJackHolesAndConnect(hostHoleId, peerHoleId);
		this.positionUpdateService.signalActivity();
	}

	private generateJackHoleId(): string {
		return Date.now().toString(36) + Math.random().toString(36).substring(2);
	}

    private addOrUpdateClient(client: WSClient) {
		const clientDevice = { clientId : client.clientId, inputIds : [], outputIds : [], wsClient:client };
        const index = this.wsClients.findIndex(c => c.clientId === client.clientId);
        if (index >= 0) {
            this.wsClients[index] = {...this.wsClients[index], ...client};
			this.clientDevices[index] = {...this.clientDevices[index], ...clientDevice};
        } else {
            this.wsClients.push(client);
			this.clientDevices.push(clientDevice);
        }
    }

    private removeClient(clientId: string) {
        this.wsClients = this.wsClients.filter(c => c.clientId !== clientId);
        this.clientDevices = this.clientDevices.filter(c => c.clientId !== clientId);
       
    }


}
