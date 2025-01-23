const { resolve } = require("node:path");
const fastify = require("fastify")({ logger: false });
const {
	nameValidator,
	emailValidator,
	phoneValidator,
	messageValidator,
} = require("../src/js/utils/validators");
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
	// fastify.log.info(`Получен feedback: ${JSON.stringify(request.body)}`);
	const checkers = new Map([
		["feedback-name", { validate: nameValidator }],
		["feedback-email", { validate: emailValidator }],
		["feedback-phone", { validate: phoneValidator }],
		["feedback-message", { validate: messageValidator }],
	]);
	const fields = {};
	let errorCount = 0;
	checkers.forEach((options, id) => {
		const result = options.validate(request.body[id]);
		if (result !== "OK") {
			errorCount += 1;
			fields[id] = result;
		}
	});
	const data = {};
	if (errorCount > 0) {
		data.status = "error";
		data.fields = fields;
		data.msg = "Серверная валидация не пройдена";
	} else {
		data.status = "success";
		data.msg = "Ваша заявка успешно отправлена";
	}
	return data;
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
