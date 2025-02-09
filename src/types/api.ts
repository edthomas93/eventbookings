import { paths, components } from './api-types';

export interface Auth {
  RegisterReqBody: paths['/auth/register']['post']['requestBody']['content']['application/json'];
  RegisterResBody: paths['/auth/register']['post']['responses']['201']['content']['application/json'];
  LoginReqBody: paths['/auth/login']['post']['requestBody']['content']['application/json'];
  LoginResBody: paths['/auth/login']['post']['responses']['200']['content']['application/json'];
}

type UsersResponse = components['schemas']['User'];

export interface Users {
  ListResBody: UsersResponse[];
  GetResBody: UsersResponse;
  PatchReqBody: paths['/users/{id}']['patch']['requestBody']['content']['application/json'];
  PatchResBody: UsersResponse;
}

type EventsResponse = components['schemas']['Event'];

export interface Events {
  PostReqBody: paths['/events']['post']['requestBody']['content']['application/json'];
  PostResBody: EventsResponse;
  ListResBody: EventsResponse[];
  GetResBody: EventsResponse;
  PatchReqBody: paths['/events/{id}']['patch']['requestBody']['content']['application/json'];
  PatchResBody: EventsResponse;
}

type BookingsResponse = components['schemas']['Event'];

export interface Bookings {
  PostReqBody: paths['/bookings']['post']['requestBody']['content']['application/json'];
  PostResBody: BookingsResponse;
  ListResBody: BookingsResponse[];
  GetResBody: BookingsResponse;
  PatchResBody: BookingsResponse;
}
