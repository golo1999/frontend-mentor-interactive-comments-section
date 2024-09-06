using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Web;
using Microsoft.OpenApi.Models;
using server.Services.Repository;
using server.Services.Service;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Add services to the container.

builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddControllers().AddNewtonsoftJson();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        builder =>
        {
            builder.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod();
        });
});
builder.Services.AddDbContext<server.Models.Contexts.DatabaseContext>(options =>
{
    options.UseSqlServer(connectionString);
});
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    // Enabled OAuth security in Swagger
    c.AddSecurityRequirement(new OpenApiSecurityRequirement() {
    {
      new OpenApiSecurityScheme {
        Reference = new OpenApiReference {
            Type = ReferenceType.SecurityScheme,
              Id = "oauth2"
          },
          Scheme = "oauth2",
          Name = "oauth2",
          In = ParameterLocation.Header
      },
      new List < string > ()
    }
  });
    c.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.OAuth2,
        Flows = new OpenApiOAuthFlows
        {
            Implicit = new OpenApiOAuthFlow()
            {
                AuthorizationUrl = new Uri("https://login.microsoftonline.com/6bb41fe4-40a3-4a10-b6cd-38278e78b21a/oauth2/v2.0/authorize"),
                TokenUrl = new Uri("https://login.microsoftonline.com/6bb41fe4-40a3-4a10-b6cd-38278e78b21a/oauth2/v2.0/token"),
            }
        }
    });
});
builder.Services.AddTransient<ICommentRepository, CommentRepository>();
builder.Services.AddTransient<ICommentService, CommentService>();
builder.Services.AddTransient<IUserRepository, UserRepository>();
builder.Services.AddTransient<IUserService, UserService>();
builder.Services.AddTransient<IVoteRepository, VoteRepository>();
builder.Services.AddTransient<IVoteService, VoteService>();
builder.Services.AddTransient(provider => new Lazy<ICommentService>(() => provider.GetRequiredService<ICommentService>()));
builder.Services.AddTransient(provider => new Lazy<IVoteService>(() => provider.GetRequiredService<IVoteService>()));
builder.Services
  .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
  .AddMicrosoftIdentityWebApi(options =>
  {
      builder.Configuration.Bind("AzureAd", options);
      options.TokenValidationParameters.NameClaimType = "preferred_username";
  },
    options => builder.Configuration.Bind("AzureAd", options));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.OAuthAppName("Swagger Client");
        options.OAuthClientId(builder.Configuration.GetValue<string>("AzureAd:ClientId"));
        options.OAuthScopes("openid", "email", "api://f1aad6c7-4ed7-45ba-811f-1ce7c96992cf/InteractiveCommentsSection");
        options.OAuthClientSecret(builder.Configuration.GetValue<string>("AzureAd:ClientSecret"));
        options.OAuthUseBasicAuthenticationWithAccessCodeGrant();
    });
}

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
