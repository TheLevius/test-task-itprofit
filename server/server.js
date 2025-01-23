const { resolve } = require("node:path");
const fastify = require("fastify")({ logger: false });

fastify.register(require("@fastify/static"), {
	root: resolve(__dirname, "../dist"),
	index: ["index.html"],
	list: true,
	prefix: "/",
});
fastify.get("/", async (request, reply) => {
	return reply.sendFile("index.html");
});
fastify.post("/api/feedback", async (request, reply) => {
	fastify.log.info(`Получен feedback: ${JSON.stringify(request.body)}`);

	return {
		status: "success",
		msg: "Ваша заявка успешно отправлена",
		fields: request.body,
	};
});

const start = async () => {
	try {
		await fastify.listen({ port: 5000 });
		fastify.log.info(`Сервер запущен на http://localhost:5000`);
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

start();
