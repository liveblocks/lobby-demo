# Early lobby concept demo by Liveblocks

This project illustrates the Lobby room concept that we're currently prototyping and
testing out. 

This uses Redis to track how many users are in each room and find the least occupied room in the lobby (or create a new one if every room is full).

Currently limited to 3 users per room (configured in /api/lobby/[lobbyId]/index.ts).

## See it live

See it live on https://lobby-demo.vercel.app/. To use it, open a bunch of tabs on the same
machine.

## Work on it locally

### Install redis

If you're on mac and you're using homebrew

Install redis with:

```shell
brew install redis
```

And start a new redis server locally with

```shell
redis-server
```

If you're using a different stack, use one of the other setup guides: https://redis.io/docs/getting-started/

### Start your next app

First, install dependencies with `npm install`.

Then simply run `npm run dev` locally.
