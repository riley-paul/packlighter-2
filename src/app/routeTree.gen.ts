/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as WithSidebarImport } from './routes/_withSidebar'
import { Route as WithSidebarIndexImport } from './routes/_withSidebar.index'
import { Route as WithSidebarListListIdImport } from './routes/_withSidebar.list.$listId'

// Create/Update Routes

const WithSidebarRoute = WithSidebarImport.update({
  id: '/_withSidebar',
  getParentRoute: () => rootRoute,
} as any)

const WithSidebarIndexRoute = WithSidebarIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => WithSidebarRoute,
} as any)

const WithSidebarListListIdRoute = WithSidebarListListIdImport.update({
  id: '/list/$listId',
  path: '/list/$listId',
  getParentRoute: () => WithSidebarRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_withSidebar': {
      id: '/_withSidebar'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof WithSidebarImport
      parentRoute: typeof rootRoute
    }
    '/_withSidebar/': {
      id: '/_withSidebar/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof WithSidebarIndexImport
      parentRoute: typeof WithSidebarImport
    }
    '/_withSidebar/list/$listId': {
      id: '/_withSidebar/list/$listId'
      path: '/list/$listId'
      fullPath: '/list/$listId'
      preLoaderRoute: typeof WithSidebarListListIdImport
      parentRoute: typeof WithSidebarImport
    }
  }
}

// Create and export the route tree

interface WithSidebarRouteChildren {
  WithSidebarIndexRoute: typeof WithSidebarIndexRoute
  WithSidebarListListIdRoute: typeof WithSidebarListListIdRoute
}

const WithSidebarRouteChildren: WithSidebarRouteChildren = {
  WithSidebarIndexRoute: WithSidebarIndexRoute,
  WithSidebarListListIdRoute: WithSidebarListListIdRoute,
}

const WithSidebarRouteWithChildren = WithSidebarRoute._addFileChildren(
  WithSidebarRouteChildren,
)

export interface FileRoutesByFullPath {
  '': typeof WithSidebarRouteWithChildren
  '/': typeof WithSidebarIndexRoute
  '/list/$listId': typeof WithSidebarListListIdRoute
}

export interface FileRoutesByTo {
  '/': typeof WithSidebarIndexRoute
  '/list/$listId': typeof WithSidebarListListIdRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_withSidebar': typeof WithSidebarRouteWithChildren
  '/_withSidebar/': typeof WithSidebarIndexRoute
  '/_withSidebar/list/$listId': typeof WithSidebarListListIdRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '' | '/' | '/list/$listId'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/list/$listId'
  id:
    | '__root__'
    | '/_withSidebar'
    | '/_withSidebar/'
    | '/_withSidebar/list/$listId'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  WithSidebarRoute: typeof WithSidebarRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  WithSidebarRoute: WithSidebarRouteWithChildren,
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
        "/_withSidebar"
      ]
    },
    "/_withSidebar": {
      "filePath": "_withSidebar.tsx",
      "children": [
        "/_withSidebar/",
        "/_withSidebar/list/$listId"
      ]
    },
    "/_withSidebar/": {
      "filePath": "_withSidebar.index.tsx",
      "parent": "/_withSidebar"
    },
    "/_withSidebar/list/$listId": {
      "filePath": "_withSidebar.list.$listId.tsx",
      "parent": "/_withSidebar"
    }
  }
}
ROUTE_MANIFEST_END */
