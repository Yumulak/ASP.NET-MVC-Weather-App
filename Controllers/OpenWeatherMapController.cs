using System.Net;
using System.Text.Json.Serialization;
using ASP.NET_MVC_WeatherApp.Models;
using Microsoft.AspNetCore.Mvc;
using Weatherly.Class;
using Newtonsoft.Json;
using System.Text;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using static System.Net.WebRequestMethods;
using Microsoft.Extensions.Primitives;
using Humanizer;
using System.Security.Cryptography.X509Certificates;
using Newtonsoft.Json.Linq;
using System.Globalization;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Authorization;

namespace ASP.NET_MVC_WeatherApp.Controllers
{
	public class OpenWeatherMapController : Controller
	{

		HttpClient client = new HttpClient();
		[Authorize]
		[HttpGet]
		public IActionResult Index()
		{			
			return View();
		}	
		public OpenWeatherMap FillCity()
		{
			OpenWeatherMap openWeatherApp = new OpenWeatherMap
			{
				lat = "33.44",
				lon = "-94.04"
			};            

			return openWeatherApp;
		}

        [HttpPost]
		public async Task<Geocoder> ConvertGeocode(string cityName, string stateCode, string countryCode)
		{
            Geocoder geocoder = new Geocoder();			
            if (cityName != null && stateCode != null && countryCode != null)
			{
				string apiKey = "38c0927bf0a04a186a70bcaa540afe92";
				string url = $"http://api.openweathermap.org/geo/1.0/direct?q={cityName},{stateCode},{countryCode}&limit={1}&appid={apiKey}";

				HttpResponseMessage responseBody = await client.GetAsync(url);

				if(responseBody.IsSuccessStatusCode)
				{
                    string apiResponse = await responseBody.Content.ReadAsStringAsync();
				
					JArray jsonResults = JArray.Parse(apiResponse);
					if (jsonResults.Count > 0)
					{
						geocoder.lat = (string)jsonResults[0]["lat"];
						geocoder.lon = (string)jsonResults[0]["lon"];
						geocoder.cityName = (string)jsonResults[0]["name"];
						geocoder.countryCode = (string)jsonResults[0]["country"];
						geocoder.stateCode = (string)jsonResults[0]["state"];

						return geocoder;
					}
					else
					{
						return geocoder;
						//put error message in this path
					}
				}
				else
				{
                    return geocoder;
                }
            }
			else
			{
				return geocoder;
			}
        }

		[HttpPost]
		public async Task<ActionResult> GetWeather(string cityName, string stateCode, string countryCode)
		{
			OpenWeatherMap openWeatherMap = FillCity();			
			Geocoder geocoder = await ConvertGeocode(cityName, stateCode, countryCode);

			if (geocoder.lat != null && geocoder.lon != null)
			{
				
				string apiKey = "38c0927bf0a04a186a70bcaa540afe92";

				string url = $"https://api.openweathermap.org/data/3.0/onecall?lat={geocoder.lat}&lon={geocoder.lon}&exclude=hourly,minutely,daily,alerts,timezone,timezone_offset&appid={apiKey}&units=imperial";

                HttpResponseMessage responseBody = await client.GetAsync(url);

				if(responseBody.IsSuccessStatusCode)
				{
					string apiResponse = await responseBody.Content.ReadAsStringAsync();
					Root rootObject = JsonConvert.DeserializeObject<Root>(apiResponse);
					
					var weatherIcon = $"https://openweathermap.org/img/wn/{rootObject.current.weather[0].icon}@2x.png";
					
					StringBuilder sb = new StringBuilder();
					sb.Append("<table><tr><th>Weather Description</th></tr>");
					sb.Append("<tr><td>Coordinates: </td><td>" + rootObject.lat +", "+ rootObject.lon + "</td></tr>");
					sb.Append("<tr><td>City/State: </td><td>" + geocoder.cityName +", "+ geocoder.stateCode + "</td></tr>");
					sb.Append("<tr><td>Country/Major City: </td><td>" + rootObject.timezone + "</td></tr>");
					sb.Append("<tr><td>Wind: </td><td>" + rootObject.current.wind_speed + " MPH</td></tr>");
					sb.Append("<tr><td>Temperature: </td><td>" + rootObject.current.temp + " °F</td></tr>");
					sb.Append("<tr><td>Humidity: </td><td>" + rootObject.current.humidity + "</td></tr>");
					sb.Append("<tr><td>Weather: </td><td>" + rootObject.current.weather[0].description.ToUpper() +" "+ $"<img src='{weatherIcon}'  >" + "</td></tr>");
					sb.Append("</table>");                   
                    openWeatherMap.apiResponse = sb.ToString();
				}								
			}
            else
			{
				return View("Index");
			}
			return RedirectToAction("Forecast", openWeatherMap);
		}
		public IActionResult Forecast(OpenWeatherMap openWeatherMap)
		{			
			return View(openWeatherMap);
		}
	}
}
