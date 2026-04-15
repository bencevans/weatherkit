import type z from "zod";
import {
  GetAvailabilityRequestSchema,
  GetWeatherRequestSchema,
  type DataSets,
} from "./models.js";

export class WeatherKit {
  private apiKey: string;
  private validateParameters: boolean;

  constructor(
    apiKey: string,
    options?: { validateParameters?: boolean; validateResponse?: boolean },
  ) {
    this.apiKey = apiKey;
    this.validateParameters = options?.validateParameters ?? true;
  }

  private async get(
    endpoint: string,
    params: Record<string, string>,
  ): Promise<any> {
    const url = new URL(`https://weatherkit.apple.com/api/v1/${endpoint}`);
    Object.entries(params).forEach(([key, value]) =>
      url.searchParams.append(key, value),
    );

    console.log(`Fetching: ${url.toString()}`);
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error fetching weather data: ${response.statusText}`);
    }
    return await response.json();
  }

  /**
   * Obtain weather data for the specified location.
   */
  async getWeather(
    request: z.infer<typeof GetWeatherRequestSchema>,
  ): Promise<any> {
    const parsedRequest = this.validateParameters
      ? GetWeatherRequestSchema.parse(request)
      : request;

    const params: Record<string, string> = {};

    for (const [key, value] of Object.entries(parsedRequest)) {
      if (["language", "latitude", "longitude"].includes(key)) {
        continue;
      }

      if (value !== undefined) {
        params[key] = value.toString();
      }
    }

    return await this.get(
      `weather/${parsedRequest.language}/${parsedRequest.latitude}/${parsedRequest.longitude}`,
      params,
    );
  }

  /**
   * Determine the data sets available for the specified location.
   */
  async getAvailability(
    request: z.infer<typeof GetAvailabilityRequestSchema>,
  ): Promise<DataSets[]> {
    const parsedRequest = this.validateParameters
      ? GetAvailabilityRequestSchema.parse(request)
      : request;

    const params: Record<string, string> = {};

    for (const [key, value] of Object.entries(parsedRequest)) {
      if (["latitude", "longitude"].includes(key)) {
        continue;
      }

      if (key === "dataSets" && Array.isArray(value)) {
        params[key] = value.join(",");
        continue;
      }

      if (value !== undefined) {
        params[key] = value.toString();
      }
    }

    return await this.get(
      `availability/${parsedRequest.latitude}/${parsedRequest.longitude}`,
      params,
    );
  }
}
