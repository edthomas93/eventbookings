import { paths, components } from './api-types';

type UsersResponse = components['schemas']['User'];

export interface Users {
  PostReqBody: paths['/users']['post']['requestBody']['content']['application/json'];
  PostResBody: UsersResponse;
  ListResBody: UsersResponse[];
  GetResBody: UsersResponse;
  PatchReqBody: paths['/users/{id}']['patch']['requestBody']['content']['application/json'];
  PatchResBody: UsersResponse;
}

type EventsResponse = components['schemas']['Event'];

export interface Events {
  PostReqBody: paths['/events']['post']['requestBody'];
  PostResBody: EventsResponse;
  ListResBody: EventsResponse[];
  GetResBody: EventsResponse;
  PatchReqBody: paths['/events/{id}']['patch']['requestBody'];
  PatchResBody: EventsResponse;
}

type BookingsResponse = components['schemas']['Event'];

export interface Bookings {
  PostReqBody: paths['/bookings']['post']['requestBody'];
  PostResBody: BookingsResponse;
  ListResBody: BookingsResponse[];
  GetResBody: BookingsResponse;
  PatchResBody: BookingsResponse;
}
