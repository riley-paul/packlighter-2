/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'

// Create Virtual Routes

const ListListIdLazyImport = createFileRoute('/list/$listId')()

// Create/Update Routes

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const ListListIdLazyRoute = ListListIdLazyImport.update({
  id: '/list/$listId',
  path: '/list/$listId',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/list.$listId.lazy').then((d) => d.Route))

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/list/$listId': {
      id: '/list/$listId'
      path: '/list/$listId'
      fullPath: '/list/$listId'
      preLoaderRoute: typeof ListListIdLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/list/$listId': typeof ListListIdLazyRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/list/$listId': typeof ListListIdLazyRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/list/$listId': typeof ListListIdLazyRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/list/$listId'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/list/$listId'
  id: '__root__' | '/' | '/list/$listId'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  ListListIdLazyRoute: typeof ListListIdLazyRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  ListListIdLazyRoute: ListListIdLazyRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/list/$listId"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/list/$listId": {
      "filePath": "list.$listId.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
