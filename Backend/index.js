import { GraphQLServer } from "graphql-yoga";
import mongoose from "mongoose";
import resolvers from "./graphql/resolvers";
import { createProxyMiddleware } from "http-proxy-middleware"; // Import the proxy middleware

mongoose.Promise = global.Promise;

mongoose
  .connect("mongodb://127.0.0.1:27017/messenger", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

mongoose.connection.once("open", () => {
  console.log("MongoDB connect");
});

const typeDefs = "./graphql/schema.graphql";

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: { pubsub: resolvers.pubsub },
});

// Define and configure the proxy middleware
const proxyMiddleware = createProxyMiddleware("/sentiment-api", {
  target: "https://naveropenapi.apigw.ntruss.com/sentiment-analysis/v1/analyze",
  changeOrigin: true,
  pathRewrite: {
    "^/sentiment-api": "", // Remove the "/sentiment-api" prefix
  },
});

// Add the proxy middleware to the server
server.express.use("/sentiment-api", proxyMiddleware);

server.start(() => console.log("Server is running on localhost:4000"));
