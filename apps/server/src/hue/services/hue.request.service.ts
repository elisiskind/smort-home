import { Inject, Injectable, Logger } from '@nestjs/common';
import { EnvService } from '../../env/env.service';
import { HueBridgeMetadata } from '../hue.bridge.factory';

@Injectable()
export class HueRequestService {
  private readonly logger = new Logger(HueRequestService.name);

  private readonly username: string;
  private readonly baseUrl: string;

  constructor(
    @Inject('HUE_BRIDGE_METADATA') hueBridgeMetadata: HueBridgeMetadata,
    readonly envService: EnvService,
  ) {
    (process.env['NODE_TLS_REJECT_UNAUTHORIZED'] as any) = 0;
    this.baseUrl = `${hueBridgeMetadata.ip}:${hueBridgeMetadata.port}/clip/v2`;
    this.username = envService.get('HUE_BRIDGE_USER');
  }

  async request(
    endpoint: string,
    options: RequestInit = { headers: {}, method: 'GET' },
  ): Promise<unknown> {
    if (!options.headers) {
      options.headers = {};
    }
    if (options.body && options.method !== 'GET') {
      (options.headers as any)['Content-Type'] = 'application/json';
    }
    options.keepalive = true;
    (options.headers as any)['hue-application-key'] = this.username;
    const url = `https://${this.baseUrl}/${endpoint}`;
    try {
      const response = await fetch(url, options);
      return response.json();
    } catch (e) {
      this.logger.error('Failed to send hue request: ', endpoint, options, e);
      throw new Error(`Failed to send hue request: ${endpoint}`);
    }
  }
}
