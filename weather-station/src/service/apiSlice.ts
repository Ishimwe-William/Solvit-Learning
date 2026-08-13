import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {apiBaseUrl, apiKey} from "../utils";
import type {WeatherDataType} from "../types/weatherTypes.ts";

export const weatherApi = createApi({
    baseQuery: fetchBaseQuery({baseUrl: `${apiBaseUrl}`}),
    endpoints: (builder) => ({
        getWeatherDataByCity: builder.query<WeatherDataType, string>({
            query: (city) => ({
                url: `/api-weather/current.json?key=${apiKey}&q=${city}`
            })
        })
    })
})

export const {useGetWeatherDataByCityQuery} = weatherApi