# xssdemos

Series of demos, for [a talk in shopee-react-knowledgable](https://github.com/Shopee/shopee-react-knowledgeable/issues/176).

## Architecture

Uses [service-mocker](https://github.com/service-mocker/service-mocker) as a simple server that supports data persistency. Data persistency is achieved using [ServiceWorker's Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache).

Each demo is called "story" and is served in different folders. There are 7 stories.

## Starting the project

To start a particular demo, pass `NUMBER` as environment variable. The command below utilizes `cross-env` for Windows support.

```
> yarn cross-env NUMBER=X yarn start
```

For example,

```
> yarn cross-env NUMBER=2 yarn start
```

will start serving the 2nd story (02-cms-naive).
