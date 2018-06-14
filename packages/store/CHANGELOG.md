# CHANGELOG
## 4.1.2 (14 June 2018)
+ rollup remove babel as the targets are esm and cjs

## 4.1.1 (14 June 2018)
+ Rollup with no treeshake to build the complete library

## 4.1.0 (14 June 2018)
+ Fixes unit tests for projects().add(object)
+ Configures rollup to not build external and peer dependencies

## 4.0.0 (3 June 2018)
+ Completely remove client-side Firestore calls and call the API instead
+ Replace Axios dependency and use fetch API

## 3.1.0 (18 May 2018)
+ Adds authOnStateChanged handler

## 3.0.0 (18 May 2018)
+ Remove firebase auth and firestore from public API
+ Remove firebase auth and firestore from unit tests

## 2.0.0 (18 May 2018)
+ Use firebase components `@firebase/app`, `@firebase/auth` and `@firebase/firetstore` individually for compact code.

## 1.0.1 (17 May 2018)
+ Rolling back firebase to 4.13.1 because 5.0.2 is broken in web

## 1.0.0 (17 May 2018)
+ SignUpUser renamed
+ Improved README.md
+ Example code

## 0.9.1 (15 May 2018)
+ `require('firebase')` will pull all Firebase dependencies by default so switched to `require('firebase/app')` and `require('/firebase/<component>)` instead.

## 0.9.0 (15 May 2018)
+ Uses minimal dependencies firebase/auth and firebase/firestore

## 0.8.0 (15 May 2018)
+ Expose sdk.firestore and sdk.auth Firestore and Auth instances to the caller for custom Firebase calls

## 0.7.0 (14 May 2018)
+ Updated package.json dependencies to use firebase 5.0.2
+ firebase 5 Release notes Updated the return type signature for signInWithEmailAndPassword, signInWithCustomToken, signInAnonymously and createUserWithEmailAndPassword to return a promise that resolves with a UserCredential instead of a user.

## 0.6.2 (14 May 2018)
+ Change the repository name to capturoo-dashboard-sdk
+ Alter CHANGELOG.md markdown syntax

## 0.6.1 (8 May 2018)
+ Fix missing scope let on web client public API Key generator

## 0.6.0
+ Generator public API Keys using both cryto.randomBytes and window.crypto.getRandomValues for testing and browser SDK
+ signupUser method added to client DashboardSDK including sending email verification and settings Auth user displayName
+ Firebase timestamp warning messages fixed

## 0.5.0
+ Use one-to-one mapping between Firebase auth uid and Account accountId
+ Improved unit tests

## 0.4.1
+ Fix broken dependency

## 0.4.0
+ Refactor Model layer. Improved unit testing.

## 0.3.0
+ Leads Create, Read, Delete and List including Mocha unit tests

## 0.2.2
+ Fix version string

## 0.2.1
+ Export Model class

## 0.2.0
+ Restructure to export module components

## 0.1.0
+ Basic unit tests and SDK
