# QvA Hub LAN Monitor
Network monitoring interface for QvA Hub LAN system

![QvA Hub LAN Monitor](/docs/qvahublanmonitor.png)

## Overview
Angular-based monitoring dashboard for QvA Hub LAN. Provides real-time visualization of network connections, client status, and system health metrics.

## Features
- Real-time connection status display
- Client management interface
- Network topology visualization
- Performance metrics
- WebRTC stream monitoring

## Installation
```bash
npm install qva-hub-lan-monitor
```

### Dependencies
- @angular/core: ^16.2.0
- @angular/material: ^16.2.0
- qvahub-lan-core: ^1.0.0
- qva-connection-topology-visualizer: ^1.0.0

## Usage
```typescript
import { QvaHubLanMonitorModule } from 'qva-hub-lan-monitor';

@NgModule({
  imports: [
    QvaHubLanMonitorModule
  ]
})
```

## Development
Built and tested using QvATPC for efficient development workflow.
Run `ng serve` for development server at http://localhost:52401

## Community
Join our Google Group for discussions and updates:
queaso-van-alles@googlegroups.com

## License
MIT License - © 2025 Queaso van Alles