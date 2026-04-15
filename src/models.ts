import { z } from "zod";

export const LatitudeSchema = z
  .number()
  .describe("The latitude of the desired location.")
  .min(-90)
  .max(90);

export type Latitude = z.infer<typeof LatitudeSchema>;

export const LongitudeSchema = z
  .number()
  .describe("The longitude of the desired location.")
  .min(-180)
  .max(180);

export type Longitude = z.infer<typeof LongitudeSchema>;

export const DataSetsSchema = z
  .enum([
    "currentWeather",
    "forecastDaily",
    "forecastHourly",
    "forecastNextHour",
    "weatherAlerts",
  ])
  .describe("The data sets to include in the response.");

export type DataSets = z.infer<typeof DataSetsSchema>;

export const GetWeatherRequestSchema = z.object({
  language: z
    .string()
    .describe("The language tag to use for localizing responses."),
  latitude: LatitudeSchema,
  longitude: LongitudeSchema,
  countryCode: z
    .string()
    .optional()
    .describe(
      "The ISO Alpha-2 country code for the requested location. This parameter is necessary for weather alerts.",
    ),
  currentAsOf: z.iso
    .datetime()
    .optional()
    .describe("The time to obtain current conditions. Defaults to now."),
  dailyEnd: z.iso
    .datetime()
    .optional()
    .describe(
      "The time to end the daily forecast. If this parameter is absent, daily forecasts run for 10 days.",
    ),
  dailyStart: z.iso
    .datetime()
    .optional()
    .describe(
      "The time to start the daily forecast. If this parameter is absent, daily forecasts start on the current day.",
    ),
  dataSets: z
    .array(DataSetsSchema)
    .describe("The data sets to include in the response."),
  hourlyEnd: z.iso
    .datetime()
    .optional()
    .describe(
      "The time to end the hourly forecast. If this parameter is absent, hourly forecasts run 24 hours or the length of the daily forecast, whichever is longer.",
    ),
  hourlyStart: z.iso
    .datetime()
    .optional()
    .describe(
      "The time to start the hourly forecast. If this parameter is absent, hourly forecasts start on the current hour.",
    ),
  timezone: z
    .string()
    .describe(
      "The name of the timezone to use for rolling up weather forecasts into daily forecasts.",
    ),
});

export type GetWeatherRequest = z.infer<typeof GetWeatherRequestSchema>;

export const GetAvailabilityRequestSchema = z.object({
  latitude: LatitudeSchema,
  longitude: LongitudeSchema,
  country: z
    .string()
    .optional()
    .describe(
      "The ISO Alpha-2 country code for the requested location. This parameter is necessary for weather alerts.",
    ),
});

export type GetAvailabilityRequest = z.infer<
  typeof GetAvailabilityRequestSchema
>;

export const PrecipitationTypeSchema = z.union([
  z.literal("clear").describe("No precipitation is occurring."),
  z
    .literal("precipitation")
    .describe("An unknown type of precipitation is occuring."),
  z.literal("rain").describe("Rain or freezing rain is falling."),
  z.literal("snow").describe("Snow is falling."),
  z.literal("sleet").describe("Sleet or ice pellets are falling"),
  z.literal("hail").describe("Hail is falling"),
  z
    .literal("mixed")
    .describe("Winter weather (wintery mix or wintery showers) is falling."),
]);

export type PrecipitationType = z.infer<typeof PrecipitationTypeSchema>;

export const UnitsSystemSchema = z.union([
  z.literal("m").describe("The metric system."),
]);

export type UnitsSystem = z.infer<typeof UnitsSystemSchema>;

export const MoonPhaseSchema = z.union([
  z.literal("new").describe("The moon is not visible."),
  z
    .literal("waxingCrescent")
    .describe(
      "A crescent-shaped sliver of the moon is visible, and increasing in size.",
    ),
  z
    .literal("firstQuarter")
    .describe(
      "Approximately half of the moon is visible, and increasing in size.",
    ),
  z.literal("full").describe("The entire disc of the moon is visible."),
  z
    .literal("waxingGibbous")
    .describe("More than half of the moon is visible, and increasing in size."),
  z
    .literal("waningGibbous")
    .describe("More than half of the moon is visible, and decreasing in size."),
  z
    .literal("thirdQuarter")
    .describe(
      "Approximately half of the moon is visible, and decreasing in size.",
    ),
  z
    .literal("waningCrescent")
    .describe(
      "A crescent-shaped sliver of the moon is visible, and decreasing in size.",
    ),
]);

export type MoonPhase = z.infer<typeof MoonPhaseSchema>;

export const PressureTrendSchema = z.union([
  z.literal("rising").describe("The sea level air pressure is increasing."),
  z.literal("falling").describe("The sea level air pressure is decreasing."),
  z
    .literal("steady")
    .describe("The sea level air pressure is remaining about the same."),
]);

export type PressureTrend = z.infer<typeof PressureTrendSchema>;

export const WeatherMetadataSchema = z.object({
  attributionURL: z.string().url(),
  expireTime: z.iso.datetime(),
  latitude: LatitudeSchema,
  longitude: LongitudeSchema,
  providerName: z.string().optional(),
  readTime: z.iso.datetime(),
  reportedTime: z.iso.datetime(),
  units: UnitsSystemSchema,
  version: z.literal(1),
  sourceType: z.enum(["modeled", "station"]),
});

export type WeatherMetadata = z.infer<typeof WeatherMetadataSchema>;

export const CurrentWeatherSchema = z.object({
  name: z.literal("CurrentWeather"),
  metadata: WeatherMetadataSchema,
  asOf: z.iso
    .datetime()
    .describe("The time of the current weather conditions."),
  cloudCover: z
    .number()
    .min(0)
    .max(1)
    .optional()
    .describe(
      "The percentage of the sky covered with clouds during the period, from 0 to 1.",
    ),
  cloudCoverLowAltPct: z.number().min(0).max(1).optional(),
  cloudCoverMidAltPct: z.number().min(0).max(1).optional(),
  cloudCoverHighAltPct: z.number().min(0).max(1).optional(),
  conditionCode: z
    .string()
    .describe("The code representing the current weather condition."),
  daylight: z
    .boolean()
    .optional()
    .describe("A Boolean value indicating whether there is daylight."),
  humidity: z
    .number()
    .min(0)
    .max(1)
    .describe("The relative humidity, from 0 to 1."),
  precipitationIntensity: z
    .number()
    .describe("The intensity of precipitation in millimeters per hour."),
  pressure: z.number().describe("The atmospheric pressure in hectopascals."),
  pressureTrend: PressureTrendSchema.describe(
    "The direction of change of the sea level air pressure.",
  ),
  temperature: z
    .number()
    .describe("The current temperature in degrees Celsius."),
  temperatureApparent: z
    .number()
    .describe("The apparent temperature in degrees Celsius."),
  temperatureDewPoint: z
    .number()
    .describe("The dew point temperature in degrees Celsius."),
  uvIndex: z.number().int().describe("The UV index at the current location."),
  visibility: z.number().describe("Visibility distance in meters."),
  windDirection: z
    .number()
    .int()
    .optional()
    .describe("The wind direction in degrees."),
  windGust: z
    .number()
    .optional()
    .describe("The wind gust speed in kilometers per hour."),
  windSpeed: z.number().describe("The wind speed in kilometers per hour."),
});

export type CurrentWeather = z.infer<typeof CurrentWeatherSchema>;

export const DayPartForecastSchema = z.object({
  cloudCover: z
    .number()
    .min(0)
    .max(1)
    .describe(
      "The percentage of the sky covered with clouds during the period, from 0 to 1.",
    ),
  conditionCode: z
    .string()
    .describe("An enumeration value indicating the condition at the time."),
  forecastEnd: z.iso
    .datetime()
    .describe("The ending date and time of the forecast."),
  forecastStart: z.iso
    .datetime()
    .describe("The starting date and time of the forecast."),
  humidity: z
    .number()
    .min(0)
    .max(1)
    .describe("The relative humidity during the period, from 0 to 1."),
  precipitationAmount: z
    .number()
    .describe(
      "The amount of precipitation forecasted to occur during the period, in millimeters.",
    ),
  precipitationChance: z
    .number()
    .min(0)
    .max(1)
    .describe(
      "The chance of precipitation forecasted to occur during the period.",
    ),
  precipitationType: PrecipitationTypeSchema.describe(
    "The type of precipitation forecasted to occur during the period.",
  ),
  snowfallAmount: z
    .number()
    .describe(
      "The depth of snow as ice crystals forecasted to occur during the period, in millimeters.",
    ),
  windDirection: z
    .number()
    .int()
    .optional()
    .describe(
      "The direction the wind is forecasted to come from during the period, in degrees.",
    ),
  windSpeed: z
    .number()
    .describe(
      "The average speed the wind is forecasted to be during the period, in kilometers per hour.",
    ),
  temperatureMax: z
    .number()
    .describe(
      "The maximum temperature forecasted during the period in degrees Celsius.",
    ),
  temperatureMin: z
    .number()
    .describe(
      "The minimum temperature forecasted during the period in degrees Celsius.",
    ),
  windGustSpeedMax: z
    .number()
    .describe(
      "The maximum wind gust speed forecasted during the period, in kilometers per hour.",
    ),
  windSpeedMax: z
    .number()
    .describe(
      "The maximum sustained wind speed forecasted during the period, in kilometers per hour.",
    ),
});

export type DayPartForecast = z.infer<typeof DayPartForecastSchema>;

export const DayWeatherConditionsSchema = z.object({
  conditionCode: z
    .string()
    .describe("The code representing the forecasted weather condition."),
  daytimeForecast: DayPartForecastSchema.optional().describe(
    "The forecast between 7 AM and 7 PM for the day.",
  ),
  forecastEnd: z.iso
    .datetime()
    .describe("The ending date and time of the day."),
  forecastStart: z.iso
    .datetime()
    .describe("The starting date and time of the day."),
  maxUvIndex: z
    .number()
    .int()
    .describe("The maximum ultraviolet index value during the day."),
  moonPhase: MoonPhaseSchema.describe(
    "The phase of the moon on the specified day.",
  ),
  moonrise: z.iso
    .datetime()
    .optional()
    .describe("The time of moonrise on the specified day."),
  moonset: z.iso
    .datetime()
    .optional()
    .describe("The time of moonset on the specified day."),
  overnightForecast: DayPartForecastSchema.optional().describe(
    "The day part forecast between 7 PM and 7 AM for the overnight.",
  ),
  restOfDayForecast: DayPartForecastSchema.optional().describe(
    "The day part forecast for the remainder of the current day.",
  ),
  precipitationAmount: z
    .number()
    .describe(
      "The amount of precipitation forecasted to occur during the day, in millimeters.",
    ),
  precipitationChance: z
    .number()
    .min(0)
    .max(1)
    .describe(
      "The chance of precipitation forecasted to occur during the day.",
    ),
  precipitationType: PrecipitationTypeSchema.describe(
    "The type of precipitation forecasted to occur during the day.",
  ),
  snowfallAmount: z
    .number()
    .describe(
      "The depth of snow as ice crystals forecasted to occur during the day, in millimeters.",
    ),
  solarMidnight: z.iso
    .datetime()
    .optional()
    .describe("The time when the sun is lowest in the sky."),
  solarNoon: z.iso
    .datetime()
    .optional()
    .describe("The time when the sun is highest in the sky."),
  sunrise: z.iso
    .datetime()
    .optional()
    .describe(
      "The time when the top edge of the sun reaches the horizon in the morning.",
    ),
  sunriseAstronomical: z.iso
    .datetime()
    .optional()
    .describe(
      "The time when the sun is 18 degrees below the horizon in the morning.",
    ),
  sunriseCivil: z.iso
    .datetime()
    .optional()
    .describe(
      "The time when the sun is 6 degrees below the horizon in the morning.",
    ),
  sunriseNautical: z.iso
    .datetime()
    .optional()
    .describe(
      "The time when the sun is 12 degrees below the horizon in the morning.",
    ),
  sunset: z.iso
    .datetime()
    .optional()
    .describe(
      "The time when the top edge of the sun reaches the horizon in the evening.",
    ),
  sunsetAstronomical: z.iso
    .datetime()
    .optional()
    .describe(
      "The time when the sun is 18 degrees below the horizon in the evening.",
    ),
  sunsetCivil: z.iso
    .datetime()
    .optional()
    .describe(
      "The time when the sun is 6 degrees below the horizon in the evening.",
    ),
  sunsetNautical: z.iso
    .datetime()
    .optional()
    .describe(
      "The time when the sun is 12 degrees below the horizon in the evening.",
    ),
  temperatureMax: z
    .number()
    .describe(
      "The maximum temperature forecasted during the day in degrees Celsius.",
    ),
  temperatureMin: z
    .number()
    .describe(
      "The minimum temperature forecasted during the day in degrees Celsius.",
    ),
  windGustSpeedMax: z
    .number()
    .describe(
      "The maximum wind gust speed forecasted during the day, in kilometers per hour.",
    ),
  windSpeedAvg: z
    .number()
    .describe(
      "The average wind speed forecasted during the day, in kilometers per hour.",
    ),
  windSpeedMax: z
    .number()
    .describe(
      "The maximum sustained wind speed forecasted during the day, in kilometers per hour.",
    ),
});

export type DayWeatherConditions = z.infer<typeof DayWeatherConditionsSchema>;

export const DailyForecastSchema = z.object({
  name: z.literal("DailyForecast"),
  metadata: WeatherMetadataSchema,
  days: z
    .array(DayWeatherConditionsSchema)
    .describe("An array of the day forecast weather conditions."),
  learnMoreURL: z
    .url()
    .optional()
    .describe("A URL that provides more information about the forecast."),
});

export type DailyForecast = z.infer<typeof DailyForecastSchema>;

export const HourWeatherConditionsSchema = z.object({
  cloudCover: z
    .number()
    .min(0)
    .max(1)
    .describe(
      "The percentage of the sky covered with clouds during the period, from 0 to 1.",
    ),
  conditionCode: z
    .string()
    .describe("An enumeration value indicating the condition at the time."),
  daylight: z
    .boolean()
    .optional()
    .describe("Indicates whether the hour starts during the day or night."),
  forecastStart: z.iso
    .datetime()
    .describe("The starting date and time of the hour."),
  humidity: z
    .number()
    .min(0)
    .max(1)
    .describe("The relative humidity during the hour, from 0 to 1."),
  precipitationChance: z
    .number()
    .min(0)
    .max(1)
    .describe(
      "The chance of precipitation forecasted to occur during the hour.",
    ),
  precipitationIntensity: z
    .number()
    .describe(
      "The precipitation intensity forecasted to occur during the hour, in millimeters per hour.",
    ),
  precipitationType: PrecipitationTypeSchema.describe(
    "The type of precipitation forecasted to occur during the hour.",
  ),
  pressure: z
    .number()
    .describe(
      "The atmospheric pressure forecasted during the hour, in millibars.",
    ),
  pressureTrend: PressureTrendSchema.optional().describe(
    "The direction of change of the sea level air pressure.",
  ),
  snowfallIntensity: z
    .number()
    .optional()
    .describe(
      "The intensity of snowfall as ice crystals forecasted to occur during the hour, in millimeters per hour.",
    ),
  snowfallAmount: z
    .number()
    .describe(
      "The amount of snowfall forecasted to occur during the hour, in millimeters.",
    ),
  temperature: z
    .number()
    .describe(
      "The temperature forecasted during the hour, in degrees Celsius.",
    ),
  temperatureApparent: z
    .number()
    .describe(
      "The feels-like temperature when considering wind and humidity, at the start of the hour, in degrees Celsius.",
    ),
  temperatureDewPoint: z
    .number()
    .optional()
    .describe(
      "The temperature at which relative humidity is 100% at the top of the hour, in degrees Celsius.",
    ),
  uvIndex: z
    .number()
    .int()
    .describe(
      "The UV index forecasted to occur during the hour at the specified location.",
    ),
  visibility: z
    .number()
    .describe(
      "The visibility forecasted to occur during the hour at the specified location, in meters.",
    ),
  windDirection: z
    .number()
    .int()
    .optional()
    .describe(
      "The direction the wind is forecasted to come from during the hour, in degrees.",
    ),
  windGust: z
    .number()
    .optional()
    .describe(
      "The wind gust speed forecasted to occur during the hour, in kilometers per hour.",
    ),
  windSpeed: z
    .number()
    .describe(
      "The average wind speed forecasted to occur during the hour, in kilometers per hour.",
    ),
  precipitationAmount: z
    .number()
    .describe(
      "The amount of precipitation forecasted to occur during the hour, in millimeters.",
    ),
});

export type HourWeatherConditions = z.infer<typeof HourWeatherConditionsSchema>;

export const HourlyForecastSchema = z.object({
  name: z.literal("HourlyForecast"),
  metadata: WeatherMetadataSchema,
  hours: z
    .array(HourWeatherConditionsSchema)
    .describe("An array of hourly forecasts."),
});
export type HourlyForecast = z.infer<typeof HourlyForecastSchema>;

const ForecastMinuteSchema = z.object({
  precipitationChance: z
    .number()
    .min(0)
    .max(1)
    .describe(
      "The chance of precipitation forecasted to occur during the minute.",
    ),
  precipitationIntensity: z
    .number()
    .describe(
      "The intensity of precipitation forecasted to occur during the minute, in millimeters per hour.",
    ),
  startTime: z.iso
    .datetime()
    .describe("The starting date and time of the minute forecast."),
});

export type ForecastMinute = z.infer<typeof ForecastMinuteSchema>;

export const ForecastPeriodSummarySchema = z.object({
  condition: PrecipitationTypeSchema.describe(
    "The type of precipitation forecasted.",
  ),
  endTime: z.iso
    .datetime()
    .optional()
    .describe("The ending date and time of the forecast period."),
  precipitationChance: z
    .number()
    .min(0)
    .max(1)
    .describe(
      "The chance of precipitation forecasted to occur during the period.",
    ),
  precipitationIntensity: z
    .number()
    .describe(
      "The intensity of precipitation forecasted to occur during the period, in millimeters per hour.",
    ),
  startTime: z.iso
    .datetime()
    .optional()
    .describe("The starting date and time of the forecast period."),
});

export type ForecastPeriodSummary = z.infer<typeof ForecastPeriodSummarySchema>;

const NextHourForecastSchema = z.object({
  name: z.literal("NextHourForecast"),
  metadata: WeatherMetadataSchema,
  forecastEnd: z.iso
    .datetime()
    .describe("The ending date and time of the next hour forecast."),
  forecastStart: z.iso
    .datetime()
    .describe("The starting date and time of the next hour forecast."),
  minutes: z
    .array(ForecastMinuteSchema)
    .describe("An array of minute-by-minute forecasts for the next hour."),
  summary: z
    .array(ForecastPeriodSummarySchema)
    .describe("A summary of the forecast for the next hour."),
});

export type ForecastNextHour = z.infer<typeof NextHourForecastSchema>;

export const WeatherResponseSchema = z.object({
  currentWeather: CurrentWeatherSchema.optional(),
  forecastDaily: DailyForecastSchema.optional(),
  forecastHourly: HourlyForecastSchema.optional(),
  forecastNextHour: NextHourForecastSchema.optional(),
  // weatherAlerts: WeatherAlertsSchema.optional(),
});

export type WeatherResponse = z.infer<typeof WeatherResponseSchema>;
