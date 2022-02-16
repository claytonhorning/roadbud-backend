# CDOT

## Prerequisites

- [Node JS](https://nodejs.org/)

## Base dependencies

- [express](https://github.com/expressjs/express) minimalist web framework for node.
- [body-parser](https://github.com/expressjs/body-parser#readme) as body parsing middleware.
- [helmet](https://github.com/helmetjs/helmet) Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!
- [mongoose](https://github.com/Automattic/mongoose) MongoDB object modeling designed to work in an asynchronous environment.

## How to Install (CLI)

1. Make sure that you have Node.js and yarn installed.
2. Clone this repo using `git clone https://github.com/taheroo/cdot`
3. Move to the appropriate directory: `cd cdot`.</br>
4. Create a `.env` file inside config folder following the example inside `.env.example`
5. Run `yarn` in order to install dependencies.</br>
6. Run `yarn start` to start app.

## Project structure

This template follows a very simple project structure:

- `src`: This folder is the main container of all the code inside your application.
  - `config`: Folder to set project configurations.
  - `models`: Folder that contains all the mongoose models.
  - `app.js`: Entry point of the application.

## Further Reading

- [NodeJS-Learning](https://github.com/sergtitov/NodeJS-Learning)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
