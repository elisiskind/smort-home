import { Injectable } from '@nestjs/common';
import { HueRequestService } from './hue.request.service';
import { groupsSchema, roomsSchema } from '../schemas/hue.room.schema';

@Injectable()
export class HueRoomService {
  constructor(private readonly requestService: HueRequestService) {}

  async getRooms() {
    const groups = await this.getGroups();
    const rooms = await this.getUnhydratedRooms();
    return rooms.map((room) => ({
      ...room,
      group: groups.find(({ owner }) => owner === room.id) ?? null,
    }));
  }

  private async getUnhydratedRooms() {
    const response = await this.requestService.request('resource/room');
    return roomsSchema.parse(response);
  }

  private async getGroups() {
    const response = await this.requestService.request(
      'resource/grouped_light',
    );
    return groupsSchema.parse(response);
  }
}
