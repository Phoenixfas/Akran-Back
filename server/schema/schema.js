const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = require("graphql");
// const { articles, categories } = require("../sampleData");
const Article = require("../models/Article");
const Subscriber = require("../models/Subscriber");

const ArticleType = new GraphQLObjectType({
  name: "Article",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    image: { type: GraphQLString },
    desc: { type: GraphQLString },
    markdown: { type: GraphQLString },
    sanitizedHtml: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  }),
});
const SubscriberType = new GraphQLObjectType({
  name: "Subscriber",
  fields: () => ({
    id: { type: GraphQLID },
    email: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    article: {
      type: ArticleType,
      args: { id: { type: GraphQLID } },
      resolve: (parent, args) => {
        return Article.findById(args.id);
      },
    },
    articles: {
      type: new GraphQLList(ArticleType),
      resolve: () => {
        return Article.find();
      },
    },
    subscriber: {
      type: SubscriberType,
      args: { id: { type: GraphQLID } },
      resolve: (parent, args) => {
        return Subscriber.findById(args.id);
      },
    },
    subscribers: {
      type: new GraphQLList(SubscriberType),
      resolve: () => {
        return Subscriber.find();
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addArticle: {
      type: ArticleType,
      args: {
        title: { type: GraphQLString },
        image: { type: GraphQLString },
        desc: { type: GraphQLString },
        markdown: { type: GraphQLString },
      },
      resolve(parent, args) {
        const article = new Article({
          title: args.title,
          image: args.image,
          desc: args.desc,
          markdown: args.markdown,
        });
        return article.save();
      },
    },
    deleteArticle: {
      type: ArticleType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: (parent, args) => {
        return Article.findByIdAndRemove(args.id);
      },
    },
    addSubscriber: {
      type: SubscriberType,
      args: {
        email: { type: GraphQLString },
      },
      resolve(parent, args) {
        const subscriber = new Subscriber({
          email: args.email,
        });
        return subscriber.save();
      },
    },
    deleteSubscriber: {
      type: SubscriberType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: (parent, args) => {
        return Subscriber.findByIdAndRemove(args.id);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
