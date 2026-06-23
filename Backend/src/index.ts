import { createApp } from './app';
import { env } from './config/env';
import { startNlpConsumer } from './queues/nlp.consumer';

const app = createApp();

startNlpConsumer();

app.listen(env.PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${env.PORT}`);
});
