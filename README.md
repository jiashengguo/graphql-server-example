# ZenStack GraphQL Backend Sample

## Getting Started

1. run `npm install`
2. run `npm build`
3. run `npm start`
4. open `http://localhost:4000/graphql` in your browser
5. run the following query with HTTP header `X-USER-ID`: 1
    ```graphql
    query ExampleQuery {
        posts {
            id
            title
        }
    }
    ```
