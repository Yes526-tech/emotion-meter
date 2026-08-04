# Base image olarak ASP.NET Core 9.0 Runtime kullanıyoruz
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

# Build image olarak .NET 9.0 SDK kullanıyoruz
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["emotion_meter.csproj", "./"]
RUN dotnet restore "./emotion_meter.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "emotion_meter.csproj" -c Release -o /app/build

# Uygulamayı publish ediyoruz
FROM build AS publish
RUN dotnet publish "emotion_meter.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Son image oluşturuluyor
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Render, ASP.NET Core uygulamalarını genellikle 8080 portundan dinler
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "emotion_meter.dll"]
