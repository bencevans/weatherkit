import { describe, expect, it } from "vitest";
import {
  ConditionCodeSchema,
  WeatherKit,
  conditionCodes,
} from "./index.js";
import {
  DataSetsSchema,
  WeatherResponseSchema,
  type DataSets,
} from "./models.js";
import z from "zod";

describe("Condition codes", () => {
  it("exports documented WeatherKit condition codes", () => {
    expect(conditionCodes).toHaveLength(34);
    expect(conditionCodes.every(({ code }) => ConditionCodeSchema.safeParse(code).success)).toBe(true);
    expect(conditionCodes.find(({ code }) => code === "Clear")).toEqual({
      code: "Clear",
      description: "Clear",
      type: "visibility",
    });
  });

  it("rejects unknown condition codes", () => {
    expect(() => ConditionCodeSchema.parse("ThunderSnow")).toThrow();
  });
});

describe("WeatherKit integration", () => {
  const integrationKey = process.env.APPLE_WEATHERKIT_API_KEY;
  const locations = [
    {
      name: "San Francisco",
      latitude: 37.7749,
      longitude: -122.4194,
      countryCode: "US",
      timezone: "America/Los_Angeles",
      language: "en",
    },
    {
      name: "London",
      latitude: 51.5074,
      longitude: -0.1278,
      countryCode: "GB",
      timezone: "Europe/London",
      language: "en",
    },
    {
      name: "Tokyo",
      latitude: 35.6762,
      longitude: 139.6503,
      countryCode: "JP",
      timezone: "Asia/Tokyo",
      language: "en",
    },
    {
      name: "Sydney",
      latitude: -33.8688,
      longitude: 151.2093,
      countryCode: "AU",
      timezone: "Australia/Sydney",
      language: "en",
    },
  ] as const;

  const datasetsToValidate = [
    "currentWeather",
    "forecastDaily",
    "forecastHourly",
    "forecastNextHour",
  ] as const satisfies DataSets[];

  it.skipIf(!integrationKey)(
    "fetches live weather data for multiple locations",
    async () => {
      const client = new WeatherKit(integrationKey as string);

      for (const location of locations) {
        const availabilityResult = await client.getAvailability({
          latitude: location.latitude,
          longitude: location.longitude,
          country: location.countryCode,
        });

        console.log(`${location.name} availability:`, availabilityResult);

        const availableDataSets = z
          .array(DataSetsSchema)
          .parse(availabilityResult);
        expect(availableDataSets.length).toBeGreaterThan(0);

        const supportedDataSets = datasetsToValidate.filter((dataset) =>
          availableDataSets.includes(dataset),
        );

        expect(supportedDataSets.length).toBeGreaterThan(0);

        for (const dataset of supportedDataSets) {
          const weatherResult = await client.getWeather({
            latitude: location.latitude,
            longitude: location.longitude,
            dataSets: [dataset],
            timezone: location.timezone,
            language: location.language,
            countryCode: location.countryCode,
          });

          console.log(
            `Weather result for ${location.name}, dataset ${dataset}:`,
            weatherResult,
          );

          expect(
            WeatherResponseSchema.strict().parse(weatherResult),
          ).toBeTruthy();
          expect(WeatherResponseSchema.strict().parse(weatherResult)).toEqual(
            weatherResult,
          );
        }
      }
    },
    120_000,
  );
});
