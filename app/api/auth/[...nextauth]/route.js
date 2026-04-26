// app/api/auth/[...nextauth]/route.js

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import mongoose from 'mongoose';

// ─── نفس الـ connection logic بتاعت /api/data ───
const MONGO_URI = process.env.MONGO_URI;

if (!globalThis._mongo) globalThis._mongo = { conn: null, promise: null };
if (!globalThis._mongoModels) globalThis._mongoModels = {};

async function connectToMongo() {
  if (globalThis._mongo.conn) return globalThis._mongo.conn;
  if (!MONGO_URI) throw new Error('MONGO_URI is not defined');

  if (!globalThis._mongo.promise) {
    globalThis._mongo.promise = mongoose
      .connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((m) => m);
  }

  globalThis._mongo.conn = await globalThis._mongo.promise;
  return globalThis._mongo.conn;
}

const schema = new mongoose.Schema({}, { strict: false });

function getAuthModel() {
  const modelName = 'Model_auth';
  if (globalThis._mongoModels['auth']) return globalThis._mongoModels['auth'];
  const Model = mongoose.models[modelName] || mongoose.model(modelName, schema, 'auth');
  globalThis._mongoModels['auth'] = Model;
  return Model;
}

// ─── NextAuth Config ───
const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        nameOrEmail:   { label: 'Name or Email', type: 'text'     },
        password:      { label: 'Password',      type: 'password' },
      },

      async authorize(credentials) {
        if (!credentials?.nameOrEmail || !credentials?.password) return null;

        try {
          await connectToMongo();
          const AuthModel = getAuthModel();
          const users = await AuthModel.find({}).lean();

          const identifier = credentials.nameOrEmail.toLowerCase().trim();

          const user = users.find(u =>
            u.name?.toLowerCase().trim()  === identifier ||
            u.email?.toLowerCase().trim() === identifier
          );

          if (!user) return null;
          if (user.password !== credentials.password) return null;

          return {
            id:            user._id?.toString(),
            name:          user.name          || null,
            email:         user.email         || null,
            phone:         user.phone         || null,
            address:       user.address       || null,
            paymentMethod: user.paymentMethod || 'cash',
          };
        } catch (error) {
          console.error('Auth Error:', error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 7,
  },

  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,

  pages: {
    signIn: '/',
    error:  '/',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id            = user.id;
        token.name          = user.name;
        token.email         = user.email;
        token.phone         = user.phone;
        token.address       = user.address;
        token.paymentMethod = user.paymentMethod;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id            = token.id;
        session.user.name          = token.name;
        session.user.email         = token.email;
        session.user.phone         = token.phone;
        session.user.address       = token.address;
        session.user.paymentMethod = token.paymentMethod;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
  },

  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };