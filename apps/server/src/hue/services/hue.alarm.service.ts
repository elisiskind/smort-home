import { Injectable, Logger } from '@nestjs/common';
import { alarmSchema } from '../schemas/hue.alarm.schema';
import { HueRequestService } from './hue.request.service';
import { EnvService } from '../../env/env.service';
import { AlarmTrigger } from '../../alarms/alarms.service';

@Injectable()
export class HueAlarmService {
  private readonly logger = new Logger(HueAlarmService.name);

  constructor(
    readonly requestService: HueRequestService,
    readonly envService: EnvService,
  ) {}

  async getAlarms() {
    const response = await this.requestService.request(
      'resource/behavior_instance',
    );
    return alarmSchema(this.envService.get('HUE_ALARM_ID')).parse(response);
  }

  setAlarmEnabled(enabled: boolean) {
    return this.requestService.request(
      `resource/behavior_instance/${this.envService.get('HUE_ALARM_ID')}`,
      {
        method: 'PUT',
        body: JSON.stringify({ enabled }),
      },
    );
  }

  setAlarmTrigger(trigger: AlarmTrigger) {
    const newTimePoint: TimePoint = {
      time: {
        minute: trigger.time.minute,
        hour: trigger.time.hour + (trigger.time.amOrPm === 'am' ? 0 : 12),
      },
      type: 'time',
    };

    return this.requestService.request(
      `resource/behavior_instance/${this.envService.get('HUE_ALARM_ID')}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          configuration: {
            ...baseAlarmConfiguration,
            when: {
              ...baseAlarmConfiguration.when,
              time_point: newTimePoint,
              recurrence_days: trigger.recurrence,
            },
          },
        }),
      },
    );
  }
}

const baseAlarmConfiguration = {
  end_brightness: 100,
  fade_in_duration: {
    seconds: 300,
  },
  style: 'sunrise',
  when: {
    recurrence_days: [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ],
    time_point: {
      time: {
        hour: 7,
        minute: 30,
      },
      type: 'time',
    },
  },
  where: [
    {
      group: {
        rid: 'ca6fff66-5b7c-4991-b6e3-b829211e750c',
        rtype: 'room',
      },
    },
  ],
} as const;

type TimePoint = {
  time: {
    hour: number;
    minute: number;
  };
  type: 'time';
};
