# Elastic search clone submission report

## Task

The task was to build a lightweight search engine that indexes docs and searches over them.

These are the things that were and were not possible to implement in the search engine in the given time:

### Success

* indexes documents into an inverted index and saves them on disk for
searching on them later. You cannot use any existing database
system.
* allows searching on previously indexed items; search works as
follows:
    1. break every search query into different terms (words/token)
    2. look up every term on inverted index and build the result set
    3. modify the rank of results using TF.IDF
* exposes 2 REST API endpoints; one for indexing data and another for
searching
    4. along with normal search, it should also have functionality to do phrase
queries. A phrase query does a search based on the phrases instead of individual term based search. ie "fox brown" should match
documents with fox and brown that appears together.
* serves a UI at `/` that allows you to search indexed docs

### Failure

* phrase queries
* caching for phrase queries
* building a UI to index elements

## API

### UI

- method: `GET`
- returns: `text/html` (UI for searching over the indexed files)

### Index

`POST` endpoint to index documents.

- method: 'POST'
- url: '/index'
- auth required: no
- payload:
    
    ```
    {
        "title": "<string>"",
        "content": "<string>"
    }
    ```

- success: 202 Accepted
    + returns: 
        ```json
        {
            "processing": "<bool>",
            "uid": "<text>""
        }
        ```
- errors:
    + 400: absent or invalid payload
    + 500: unexpected server error
    + returns:
        ```json
        {
            "code": "<text>",
            "message": "<text>",
            "path": "<text>"
        }
        ```

### Search

`GET` endpoint to search over the indexed files.

- method: 'GET'
- url: '/search'
- query parameters:
    + query:
        * raw: "<text>"
        * title: ":title <text>"
        * content: ":content <text>"
    + offset: (optional) number
    + limit: (optional) number
- success: 200 OK
- returns: 
    ```json
    {
        "count": "<integer>"
        "results": [
            ...
            {
                "title": "<text1>",
                "content": "<text1>",
                "uid": "<text>"
            },
            {
                "title": "<text2>",
                "content": "<text2>",
                "uid": "<text>"
            }
            ...
        ]
    }
    ```
- errors:
    + 400: absent or invalid request params
    + returns:
        ```json
        {
            "code": "<text>",
            "message": "<text>",
            "path": "<text>"
        }
        ```

### Document

- method: `GET`
- url: `/doc/:uid`
- returns: `text/html`

> Redirects to `/` if `:uid` is not provided

- errors:
    + 404: uid not found
    + returns: `text`

## Implementation Notes

### Database

1. A directory called `.elasticsearchclone` is created in the home directory. This is the database.
2. Two directories, `index` and `data` are created in the DB directory.

### Index

1. When a document (title and content) is requested to be indexed, a timestamp based UUID is generated that is the identity of the document.
2. A file with the filename as UUID is created in the `data` directory and a 202 response is sent with the UUID. This is done because, as the DB grows, indexing could be a relatively slow process and the user must not be kept hanging on the response.
3. Each word in the `title` and `content` is sanitized by replacing special characters with spaces and converting everything to lower case. It is associated with a JSON map and stored in `index/<word>.json` with the position of that word in the title and content. Any typical `<word>.json` looks like follows:
    ```json
    {
        "title": {
            "217c1a00-e591-11e8-b106-6db2e9eb4343": [0, 2]
        },
        "content": {
            "eed09ae0-e590-11e8-b106-6db2e9eb4343": [0],
            "03bb8640-e591-11e8-b106-6db2e9eb4343": [2],
            "217c1a00-e591-11e8-b106-6db2e9eb4343": [1]
        }
    }
    ```
4. Files have been tried to be written atomically, but requires testing at large scale.
5. Every word maintains its own map to avoid unnecessary serialization and deserialization cost.

### Search

1. When a query is made, the tokens are extracted and sanitized by lowercasing and replacing special characters with spaces.
2. Then they are looked into the inverted index and a result set is generated
3. Ranking is performed using TF-IDF. Logarithmic scaling for TF and IDF. The formula used is:
    ```
    tf(t, d) = log (1 + freq(t,d)) where freq(t,d) is the frequency of `t` in `d`

    idf(t) = log (N / T) where N is total docs and T is the docs containing t
    ```

4. Results are returned based on the `l` and `o` query parameters which are essentially the limit and offset values.

## Code structure

- src
    + client
        * src/App.js (client entrypoint)
    + server
        * index.js (server entrypoint)

## Work duration

10 Nov 9AM to 11 Nov 9PM
