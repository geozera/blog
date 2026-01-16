# Blog

This is the code used in my personal blog. The blog itself is simple, the focus of this project is to make a website that's easy to maintain and deploy.

![Homepage](docs/images/homepage.png)

The whole architecture is based on docker containers.

## Initial Setup

To start the application, you can simply run

````cmd
docker compose up -d
````

This will spin up the containers of the database, along with the API and run its migration scripts, ending with the client.

## Useful commands during development

After modifying the API code, run :

````cmd
docker compose up -d --force-recreate --build --remove-orphans api
````

Flags breakdown:

(\-\-build) Redo the build of the image (so docker compose don't uses any cached images).

(\-\-remove-orphans) Remove the packages from previous builds (for cleanup).

(\-\-force-recreate) Recreate the container even if it's already up.

(api) Only do this operation to the api service, no need to restart the other services for no reason, specially with the --build command, which can make the startup process take longer.
