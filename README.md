# Event Booking System Documentation

## Overview
A scalable, containerized Node.js application to demonstrate CRUD operations using SQL, docker orchestration, kubernetes deployment, and pub/sub mechanisms. This project is to recap modern backend development practices.

This system allows two types of users:
- **Event Hosts**: Users (e.g., bands or organizers) who can create and manage events.
- **Attendees**: Users who can browse events and make bookings to attend them.

---

## Features
- **User Management**: Create, update, delete, and list users.
- **Event Management**: Event hosts can create, update, delete, and list events.
- **Booking Management**: Attendees can book tickets for events.
- **Notifications**: Real-time notifications for event updates using Pub/Sub.

---

## Objectives
- Demonstrate SQL CRUD operations with SQLite.
- Containerize the application using Docker.
- Orchestrate services using Docker Compose and Kubernetes.
- Implement Pub/Sub communication using RabbitMQ or Kafka.
- Illustrate software architecture using UML diagrams.

---

## Users Routes

### Overview
The Users routes handle operations related to managing application users.

### Routes
- `GET /users`: Fetch all users.
- `POST /users`: Create a new user.
- `PUT /users/:id`: Update user details.
- `DELETE /users/:id`: Delete a user.

### Overview
The Events routes manage the creation, retrieval, updating, and deletion of events by event hosts.

### Routes
- `GET /events`: Fetch all events.
- `POST /events`: Create a new event.
- `PUT /events/:id`: Update event details.
- `DELETE /events/:id`: Delete an event.

## Bookings Routes

### Overview
The Bookings routes manage user bookings for events.

### Routes
- `GET /bookings`: Fetch all bookings.
- `POST /bookings`: Create a booking.
- `DELETE /bookings/:id`: Cancel a booking.

## Database Schema

### Tables
- **Users**: Manage application users.
    - `id` (Primary Key)
    - `name` (Text)
    - `email` (Text, Unique)
    - `role` (Text: "host" or "attendee")
- **Events**: Manage events.
    - `id` (Primary Key)
    - `title` (Text)
    - `description` (Text)
    - `date` (Text)
    - `host_id` (Foreign Key -> Users)
- **Bookings**: Track event bookings.
    - `id` (Primary Key)
    - `user_id` (Foreign Key -> Users)
    - `event_id` (Foreign Key -> Events)
