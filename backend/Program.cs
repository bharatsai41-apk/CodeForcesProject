using System.ComponentModel.DataAnnotations;
using System.Net.Http.Json;
using System.Threading.RateLimiting;
using Microsoft.Extensions.Caching.Distributed;
using Scalar.AspNetCore;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddOpenApi();

// Configure in-memory distributed cache
builder.Services.AddDistributedMemoryCache();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin()   // Allows any frontend domain to make requests
              .AllowAnyMethod()   // Allows GET, POST, etc.
              .AllowAnyHeader();  // Allows custom headers
    });
});

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    options.AddPolicy("IsSafePolicy", httpContext =>
            RateLimitPartition.GetFixedWindowLimiter(
                partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "global",
                factory: partition => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = 3,
                    Window = TimeSpan.FromMinutes(1),
                    QueueLimit = 0
                }));
});

var app = builder.Build();
app.UseCors("AllowFrontend");
app.UseRateLimiter();

if (!app.Environment.IsDevelopment())
{
    app.UseDefaultFiles();
    app.UseStaticFiles();
}

var client = new HttpClient { BaseAddress = new Uri("https://codeforces.com") };
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.MapGet("/health", () => Results.Ok(new { status = "healthy" }));

app.MapPost("/user-profile", async (InputDto input, IDistributedCache cache, HttpContext context) =>
    {
        // Distributed cache layer (in-memory)
        string CleanedName = input.UserName.Trim().ToLower();
        string cachekey = $"codeforces:user:{CleanedName}";
        
        var cachedData = await cache.GetStringAsync(cachekey);
        if (cachedData != null)
        {
            return Results.Ok(JsonSerializer.Deserialize<object>(cachedData));
        }

        var inforesponse = await client.GetAsync($"/api/user.info?handles={input.UserName}");
        if (!inforesponse.IsSuccessStatusCode)
        {
            return Results.BadRequest("User does not exist");
        }

        var info = await inforesponse.Content.ReadFromJsonAsync<object>();
        var status = await client.GetFromJsonAsync<object>($"/api/user.status?handle={input.UserName}");
        var finalinfo = new { info, status };
        
        // Set cache with 10-minute expiration
        var cacheOptions = new DistributedCacheEntryOptions()
            .SetAbsoluteExpiration(TimeSpan.FromMinutes(10));
        
        await cache.SetStringAsync(cachekey, JsonSerializer.Serialize(finalinfo), cacheOptions);
        return Results.Ok(finalinfo);
    }).RequireRateLimiting("IsSafePolicy");

if (!app.Environment.IsDevelopment())
{
    app.MapFallbackToFile("index.html");
}

app.Run();

public record InputDto(
    [Required]
    [MaxLength(50)]
    [MinLength(3)]
    string UserName
);