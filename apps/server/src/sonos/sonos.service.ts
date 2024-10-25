import { Injectable, OnModuleInit } from '@nestjs/common';
import { SonosManager } from '@svrooij/sonos/lib';
import { Observable } from 'rxjs';
import { ExtendedTransportState } from '@svrooij/sonos/lib/models';
import { SonosPlaybackEvent } from '@smort-home/firestore';

type PlayingState = 'PLAYING' | 'PAUSED' | 'TRANSITIONING' | 'STOPPED';

export interface SonosDevice {
  id: string;
  name: string;
  state: PlayingState;
  nowPlaying: {
    title: string | null;
    album: string | null;
    artist: string | null;
    artUrl: string | null;
  } | null;
}

export type SonosDeviceUpdate = Partial<SonosDevice> & Pick<SonosDevice, 'id'>;

const normalizePlayingState = (state: ExtendedTransportState) => {
  switch (state) {
    case 'PLAYING':
    case 'GROUP_PLAYING':
      return 'PLAYING';
    case 'TRANSITIONING':
      return 'TRANSITIONING';
    case 'PAUSED_PLAYBACK':
      return 'PAUSED';
    default:
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

  async handlePlaybackEvent(playbackEvent: SonosPlaybackEvent) {
    await Promise.all(
      this.manager.Devices.filter(
        (device) => device.Uuid === playbackEvent.id,
      ).map((device) => {
        if (playbackEvent.state === 'PLAY') {
          return device.AVTransportService.Play({ InstanceID: 0, Speed: '1' });
        } else if (playbackEvent.state === 'PAUSE') {
          return device.AVTransportService.Pause();
        }
      }),
    );
  }
}
