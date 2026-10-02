# URL Shortener Deployment

The Compose stack runs a Vite production build behind Nginx, an Express API,
PostgreSQL, and Redis. Only the web service should receive public traffic.
Nginx forwards `/api/`, `/s/`, and `/health` to the API on the internal network.

## Dokploy

1. Push this repository, including both package lockfiles, to your Git provider.
2. Create a **Docker Compose** service in your Dokploy project and connect the
   repository. Select `compose.yaml` at the repository root as the Compose file.
3. In the service's environment settings, set:

   ```dotenv
   BASE_URL=https://short.example.com
   POSTGRES_PASSWORD=your-long-random-alphanumeric-password
   ```

   Use your actual public origin with no trailing slash for `BASE_URL`. The
   password is embedded in a PostgreSQL connection URI, so use only letters and
   digits (for example, a randomly generated 64-character hex string).
4. Add a domain targeting Compose service **web**, container port **80**, path
   **/**. Point its DNS record to your Dokploy server and enable HTTPS in Dokploy.
5. Deploy. Open the domain, create a link, and confirm that opening `/s/<code>`
   redirects to the original URL. `/health` returns HTTP 200 when both database
   and cache are ready.

No host port mappings are required: Dokploy's proxy handles public access. Do not
publish the API, PostgreSQL, or Redis ports. TLS terminates at Dokploy's proxy.

## Local Docker Check

Create a root `.env` using `.env.example` as a template, with
`BASE_URL=http://localhost:8080` and a strong password. Then run:

```sh
docker compose config --quiet
docker compose up --build -d
docker compose run --rm --no-deps -p 8080:80 web
```

The final command runs a foreground web container reachable at
`http://localhost:8080`, using the running API from the stack. Stop it with
Ctrl+C, then use `docker compose down` to stop the stack.

## Storage and Operations

PostgreSQL and Redis use persistent named volumes. The schema is initialized
automatically only when PostgreSQL's data volume is empty; subsequent schema
changes need a migration. Existing local database records are not automatically
imported. Back up PostgreSQL before upgrades, and do not run
`docker compose down -v` unless you intend to delete all stored data.

The frontend uses same-origin API requests. For non-Docker development, the Vite
dev server proxies `/api` and `/s` to `http://localhost:5000`.

This application currently has public, unauthenticated link creation and history
endpoints. Add access controls and abuse protection before exposing it to an
untrusted audience.