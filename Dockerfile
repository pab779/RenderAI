FROM mcr.microsoft.com/powershell:7.4-ubuntu-22.04

WORKDIR /app

COPY . .

ENV PORT=10000
ENV RENDERAI_PUBLIC_BIND=1

EXPOSE 10000

CMD pwsh -NoLogo -NoProfile -ExecutionPolicy Bypass -File ./start-server.ps1 -Port ${PORT}
