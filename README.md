# WeatherKit

A lightweight TypeScript client for the Apple WeatherKit REST API, with Zod-powered request and response models.

## Features

- Typed client for live weather and availability endpoints
- Built-in request validation with Zod schemas
- Rich response schemas for:
  - current weather
  - daily forecast
  - hourly forecast
  - next-hour forecast
- Integration tests against the real WeatherKit API

## Installation

~~~bash
npm install @bencevans/weatherkit
~~~

If you are developing this repository locally:

~~~bash
npm install
~~~

## Authentication

Create a valid Apple WeatherKit JWT and pass it to the client:

Note: The `apiKey` in this library is your encoded JWT token.
Instructions for creating it are in Apple's WeatherKit REST API docs:
https://developer.apple.com/documentation/weatherkitrestapi/request-authentication-for-weatherkit-rest-api

~~~ts
import { WeatherKit } from "@bencevans/weatherkit";

const apiKey = process.env.APPLE_WEATHERKIT_API_KEY;
if (!apiKey) {
  throw new Error("APPLE_WEATHERKIT_API_KEY is required");
}

const client = new WeatherKit(apiKey);
~~~

## Quick Start

### Get available datasets for a location

~~~ts
const available = await client.getAvailability({
  latitude: 37.7749,
  longitude: -122.4194,
  country: "US",
});

console.log(available);
// Example: ["currentWeather", "forecastDaily", "forecastHourly", "forecastNextHour", "weatherAlerts"]
~~~

### Fetch weather data

~~~ts
const weather = await client.getWeather({
  language: "en",
  latitude: 37.7749,
  longitude: -122.4194,
  countryCode: "US",
  timezone: "America/Los_Angeles",
  dataSets: ["currentWeather", "forecastDaily"],
});

console.log(weather);
~~~

## API

### new WeatherKit(apiKey, options?)

- apiKey: string
- options.validateParameters: boolean (default: true)

When validateParameters is true, input payloads are validated with Zod before requests are sent.

### getAvailability(request)

Returns available datasets for a location.

Request fields:

- latitude (required)
- longitude (required)
- country (optional, ISO Alpha-2)

### getWeather(request)

Fetches weather payloads for one or more datasets.

Request fields:

- language (required)
- latitude (required)
- longitude (required)
- timezone (required)
- dataSets (required)
- countryCode (optional)
- currentAsOf (optional)
- dailyStart (optional)
- dailyEnd (optional)
- hourlyStart (optional)
- hourlyEnd (optional)

Supported dataSets values:

- currentWeather
- forecastDaily
- forecastHourly
- forecastNextHour
- weatherAlerts

## Validation Models

Zod schemas and inferred types are available in src/models.ts, including:

- request schemas
- dataset enums
- weather response models
- forecast metadata and nested forecast structures

## Testing

Run tests:

~~~bash
npm test
~~~

Integration tests use APPLE_WEATHERKIT_API_KEY.
If the variable is not set, integration tests are skipped.

Set the variable and run:

~~~bash
export APPLE_WEATHERKIT_API_KEY="your_jwt_here"
npm test
~~~

## Notes

- This package uses the global fetch API available in modern Node.js runtimes.
- API responses can vary by geography and provider.
