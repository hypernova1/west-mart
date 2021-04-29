import Application from './application';

const app = new Application();

app.setSequelize();
app.setMiddleware();
app.setRouter();
app.start();