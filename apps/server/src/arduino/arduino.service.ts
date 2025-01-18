import { Injectable, Logger } from '@nestjs/common';
import { EnvService } from '../env/env.service';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ArduinoService {
  private readonly ip: string;
  private readonly logger = new Logger(ArduinoService.name);

  constructor(
    envService: EnvService,
    private readonly httpService: HttpService,
  ) {
    this.ip = envService.get('ARDUINO_IP');
  }

  spray() {
    try {
      this.httpService
        .post(`http://${this.ip}/spray`, null)
        .forEach((response) => {
          this.logger.log('Response: ', response.status);
        });
    } catch (e) {
      this.logger.error('Failed to post', e);
    }
  }
}
