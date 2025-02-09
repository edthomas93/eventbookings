/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
    "/auth/register": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Register a new user */
        post: operations["registerUser"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Login a user */
        post: operations["loginUser"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Retrieve all users */
        get: operations["getUsers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Retrieve a user by ID */
        get: operations["getUserById"];
        put?: never;
        post?: never;
        /** Delete a user */
        delete: operations["deleteUser"];
        options?: never;
        head?: never;
        /** Update a user */
        patch: operations["updateUser"];
        trace?: never;
    };
    "/events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Retrieve all events */
        get: operations["getEvents"];
        put?: never;
        /** Create a new event */
        post: operations["createEvent"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/events/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Retrieve an event by ID */
        get: operations["getEventById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Update an event */
        patch: operations["updateEvent"];
        trace?: never;
    };
    "/bookings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Retrieve all bookings */
        get: operations["getBookings"];
        put?: never;
        /** Create a booking */
        post: operations["createBooking"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        AuthRegisterRequest: {
            /** @example John Doe */
            name: string;
            /**
             * Format: email
             * @example john.doe@example.com
             */
            email: string;
            /** @example MySecurePass123 */
            password: string;
            /**
             * @example host
             * @enum {string}
             */
            role: "host" | "attendee";
        };
        AuthRegisterResponse: {
            user?: components["schemas"]["User"];
            /** @example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... */
            token?: string;
        };
        AuthLoginRequest: {
            /**
             * Format: email
             * @example john.doe@example.com
             */
            email: string;
            /** @example MySecurePass123 */
            password: string;
        };
        AuthLoginResponse: {
            /** @example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... */
            token?: string;
        };
        User: {
            id?: string;
            name?: string;
            email?: string;
            /** @enum {string} */
            role?: "host" | "attendee";
        };
        CreateEventRequest: {
            title: string;
            description?: string;
            /** Format: date-time */
            startDateTime: string;
            /** Format: date-time */
            endDateTime: string;
            capacity: number;
        };
        Event: {
            id: string;
            title: string;
            description?: string;
            /** Format: date-time */
            startDateTime: string;
            /** Format: date-time */
            endDateTime: string;
            hostId: string;
            /** @example 100 */
            capacity: number;
            /** @example 25 */
            readonly numberOfAttendees?: number;
        };
        CreateBookingRequest: {
            eventId: string;
        };
        Booking: {
            id: string;
            userId: string;
            eventId: string;
        };
        EnrichedBookingResponse: {
            id: string;
            userId: string;
            eventId: string;
            event: components["schemas"]["Event"];
        };
        ErrorResponse: {
            /** @example Invalid credentials */
            error?: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    registerUser: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AuthRegisterRequest"];
            };
        };
        responses: {
            /** @description User registered successfully */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AuthRegisterResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    loginUser: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AuthLoginRequest"];
            };
        };
        responses: {
            /** @description Successful login */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AuthLoginResponse"];
                };
            };
            /** @description Bad Request (e.g., invalid credentials) */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getUsers: {
        parameters: {
            query?: {
                /** @description Filter users by role */
                role?: "host" | "attendee";
                /** @description Number of users to return */
                limit?: number;
                /** @description Offset for pagination */
                offset?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of users */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["User"][];
                };
            };
        };
    };
    getUserById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description User retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["User"];
                };
            };
            /** @description User not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    deleteUser: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description User deleted successfully */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description User not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    updateUser: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @example Updated Name */
                    name?: string;
                    /**
                     * Format: email
                     * @example updated.email@example.com
                     */
                    email?: string;
                    /**
                     * @example attendee
                     * @enum {string}
                     */
                    role?: "host" | "attendee";
                };
            };
        };
        responses: {
            /** @description User updated successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["User"];
                };
            };
            /** @description User not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getEvents: {
        parameters: {
            query?: {
                /** @description Filter events by host ID */
                hostId?: string;
                /** @description Number of events to return */
                limit?: number;
                /** @description Offset for pagination */
                offset?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of events */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Event"][];
                };
            };
        };
    };
    createEvent: {
        parameters: {
            query?: never;
            header: {
                /** @description Bearer token for authentication (Only hosts can create events) */
                Authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateEventRequest"];
            };
        };
        responses: {
            /** @description Event created successfully */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Event"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getEventById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Event retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Event"];
                };
            };
            /** @description Event not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    updateEvent: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    title?: string;
                    description?: string;
                    /** Format: date-time */
                    startDateTime?: string;
                    /** Format: date-time */
                    endDateTime?: string;
                };
            };
        };
        responses: {
            /** @description Event updated successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Event"];
                };
            };
            /** @description Event not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getBookings: {
        parameters: {
            query?: never;
            header: {
                /** @description Bearer token for authentication */
                Authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of bookings */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EnrichedBookingResponse"][];
                };
            };
        };
    };
    createBooking: {
        parameters: {
            query?: never;
            header: {
                /** @description Bearer token for authentication */
                Authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateBookingRequest"];
            };
        };
        responses: {
            /** @description Booking created successfully */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Booking"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
}
