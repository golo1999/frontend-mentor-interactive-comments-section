using Microsoft.EntityFrameworkCore;
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
builder.Services.AddSwaggerGen();
builder.Services.AddTransient<ICommentRepository, CommentRepository>();
builder.Services.AddTransient<ICommentService, CommentService>();
builder.Services.AddTransient<IUserRepository, UserRepository>();
builder.Services.AddTransient<IUserService, UserService>();
builder.Services.AddTransient<IVoteRepository, VoteRepository>();
builder.Services.AddTransient<IVoteService, VoteService>();
builder.Services.AddTransient(provider => new Lazy<ICommentService>(() => provider.GetRequiredService<ICommentService>()));
builder.Services.AddTransient(provider => new Lazy<IVoteService>(() => provider.GetRequiredService<IVoteService>()));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthorization();
app.MapControllers();

app.Run();
