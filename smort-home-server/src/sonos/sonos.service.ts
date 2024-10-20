import { Injectable, OnModuleInit } from '@nestjs/common';
import { SonosManager } from '@svrooij/sonos/lib';
import { Observable } from 'rxjs';
import { ExtendedTransportState } from '@svrooij/sonos/lib/models';

type PlayingState = 'PLAYING' | 'PAUSED' | 'TRANSITIONING' | 'STOPPED';

export interface SonosDevice {
  id: string;
  name: string;
  state: PlayingState;
  nowPlaying: {
    title: string;
    album?: string;
    artist?: string;
    artUrl?: string;
  } | null;
}

export type SonosDeviceUpdate = Partial<SonosDevice> & Pick<SonosDevice, 'id'>;

const normalizePlayingState = (state: ExtendedTransportState): PlayingState => {
  switch (state) {
    case 'PLAYING':
    case 'GROUP_PLAYING':
      return 'PLAYING';
    case 'TRANSITIONING':
      return 'TRANSITIONING';
    case 'PAUSED_PLAYBACK':
      return 'PAUSED';
    case 'GROUP_STOPPED':
    case 'STOPPED':
      return 'STOPPED';
  }
};

@Injectable()
export class SonosService implements OnModuleInit {
  private readonly manager: SonosManager = new SonosManager();

  async onModuleInit() {
    await this.manager.InitializeWithDiscovery(10);
  }

  async getDevices() {
    const promises = this.manager.Devices.map(
      async (device): Promise<SonosDevice> => {
        const state = await device.GetState();
        const track = state.mediaInfo.CurrentURIMetaData;
        return {
          id: device.Uuid,
          name: device.Name,
          state: normalizePlayingState(state.transportState),
          nowPlaying:
            track === undefined
              ? null
              : typeof track === 'string'
                ? {
                    title: track,
                    album: null,
                    artist: null,
                    artUrl: null,
                  }
                : {
                    title: track.Title ?? null,
                    album: track.Album ?? null,
                    artist: track.Artist ?? null,
                    artUrl: track.AlbumArtUri ?? null,
                  },
        };
      },
    );
    return await Promise.all(promises);
  }

  listenForUpdates(): Observable<SonosDeviceUpdate> {
    return new Observable((subscriber) => {
      this.manager.Devices.forEach(async (device) => {
        device.Events.on('transportState', (state) => {
          subscriber.next({
            id: device.Uuid,
            state: normalizePlayingState(state),
          });
        });
        device.Events.on('currentTrack', (track) => {
          subscriber.next({
            id: device.Uuid,
            nowPlaying:
              track === undefined
                ? null
                : typeof track === 'string'
                  ? {
                      title: track,
                      album: null,
                      artist: null,
                      artUrl: null,
                    }
                  : {
                      title: track.Title ?? null,
                      album: track.Album ?? null,
                      artist: track.Artist ?? null,
                      artUrl: track.AlbumArtUri ?? null,
                    },
          });
        });
      });
    });
  }
}
