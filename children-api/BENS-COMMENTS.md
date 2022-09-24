# Ben's Comments

## Gitignore

## Style

Single quotes, yo,

## Model

Zod balls hard, good choice, however the idea of keeping a `model` directory is kinda old-school, one alternative which is popular in the React world is having the MVC split into files in component-local directories, e.g.

```txt
+
|- component-1/
|  |- index.ts (entrypoint and exports)
|  |- component.ts (business logic)
|  |- model.ts (pojos)
|- component-2/
|  |- index.ts (entrypoint and exports)
|  |- component.ts (business logic)
|  |- model.ts (pojos)
```

However, even that is starting to be considered old-hat with some preferring the whole thing in one file keeping the domain and the logic tightly coupled...

I don't tend to go that far but I try to avoid a `model` directory

## Directory and File Structure

This is 100% a matter of opinion and you should go with what you fancy, my opinion on this changes daily

At the minute I'm going with:

```txt
+
|- common-file-1.ts
|- common-file-2.ts
|- category-1/
|  |- operation-1.ts
|        logic, model
|  |- operation-2.ts
|        logic, model
|- category-2/ ...
```

Which is why I've made `children` a directory with `get` and `put` as separate files.

I think it's easy to read and work with but, again, my mind will change tomorrow :D

## Tests

I know you're already aware but... write more tests...

## Package.json

### Scripts

In your `package.json` one of your scripts has `./node_modules/.bin/serverless` - this isn't needed. When running through `npm`, `./node_modules/.bin` is effectively added to your `PATH` variable - you could have just put `serverless` (or it's shorter alias `sls`).

### Node Version

Your `.nvmrc` file and the start of your readme both specify node 14.x...

Your `package.json` and `serverless.yml` both specify node 16.x...

Go with the latter option

<!-- markdownlint-disable-file MD013 -->
