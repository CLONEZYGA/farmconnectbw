Running the Expo dev server inside Docker (Windows)

Prerequisites:
- Docker Desktop running
- Your development machine and device on the same network (for LAN mode) or use Tunnel

1) Build the container
   docker compose build

2) Start the container
   docker compose up

3) Open Expo DevTools in the container output (http://localhost:19002 usually) or use the QR code printed in the container logs.

Notes:
- If you run the container on a remote machine, ensure you set EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0 and publish ports.
- For Android emulator on host, you may need to forward the Metro port.
- To make the Expo app on a physical device connect in LAN mode, set the host to your host machine's IP in the Expo DevTools "Connection" settings.

Troubleshooting:
- If Metro cannot resolve native modules, run `npm install` on host before building or remove the `node_modules` volume.
- If the app shows offline in the UI, check the container's network and ensure outgoing internet access is allowed.
