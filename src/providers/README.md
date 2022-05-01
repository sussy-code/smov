# the providers

to make this as clear as possible, here is some extra information on how the interal system works regarding providers.

| Term          | explanation                                                                           |
| ------------- | ------------------------------------------------------------------------------------- |
| Media         | Object containing information about a piece of media. like title and its id's         |
| PortableMedia | Object with just the identifiers of a piece of media. used for transport and saving   |
| MediaStream   | Object with a stream url in it. use it to view a piece of media.                      |
| Provider      | group of methods to generate media and mediastreams from a source. aliased as scraper |

All types are prefixed with MW (MovieWeb) to prevent clashing names.

## Some rules

1. **Never** remove a provider completely if it's been in use before. just disable it.
2. **Never** change the ID of a provider if it's been in use before.
3. **Never** change system of the media ID of a provider without making it backwards compatible

All these rules are because `PortableMedia` objects need to stay functional. because:

- It's used for routing, links would stop working
- It's used for storage, continue watching and bookmarks would stop working

# The list of providers and their quirks

Some providers have quirks, stuff they do differently than other providers

## TheFlix

- for series, the latest episode released will be one playing at first when you select it from search results
