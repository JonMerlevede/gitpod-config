import taskRepo from "./tasks.json"

/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
}

function generateTaskElementYaml(name: string, tasks: Array<[string, string]>): string[] {
	if (tasks.length < 1) {
		return []
	}
	let result = [`${name}: |`]
	tasks.forEach(([task, taskContent]) => {
		result.push(`  # executing ${task}`)
		result.push(...taskContent.split("\n").map(line => "  " + line))
	})
	return result
}
function generateYaml(
	url: string,
	beforeCommands: Array<[string, string]>,
	initCommands: Array<[string, string]>,
	commandCommands: Array<[string, string]>): string {
	let result: Array<string> = []
	result.push("tasks:")
	result.push(`  - name: Gitpod config (generated at ${url})`)
	result.push(...generateTaskElementYaml("before", beforeCommands).map(line => "    " + line))
	result.push(...generateTaskElementYaml("init", initCommands).map(line => "    " + line))
	result.push(...generateTaskElementYaml("command", commandCommands).map(line => "    " + line))
	return result.join("\n")
}

function generateTaskElementBash(url: string, commands: Array<[string, string]>): string {
	const { protocol, host, searchParams } = new URL(url)
	const base = `${protocol}//${host}`
	const tasks = searchParams.get("tasks")
	const tasksParam = tasks ? "?tasks=" + tasks?.replaceAll(" ", "+") : ""
	return `#!/bin/bash
# see https://github.com/JonMerlevede/gitpod-config for usage info

${commands.map(([task, taskContent]) => `# executing ${task}
${taskContent}
`
	).join("")}
	`
}

function getCommandsFromRepo(taskType: string, taskNames: string[]): Array<[string, string]> {
	const tasks: [string, string][] = []
	taskNames.forEach((taskName) => {
		if ((taskName in taskRepo) && (taskType in (<any>taskRepo)[taskName])) {
			tasks.push([taskName, <string>((<any>taskRepo)[taskName][taskType])])
		}
	})
	return tasks
}

function determineRoute(pathname: string): string {
	let route = ""
	if (pathname.startsWith("/init")) {
		route = "init"
	} else if (pathname.startsWith("/command")) {
		route = "command"
	} else if (pathname.startsWith("/before")) {
		route = "before"
	} else if (pathname.startsWith("/yaml")) {
		route = "yaml"
	}
	return route
}

function determineTaskNames(searchParams: URLSearchParams): string[] {
	return ["base"].concat(searchParams.get("tasks")?.split(" ") || [])
}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		const { pathname, searchParams } = new URL(request.url);
		const route = determineRoute(pathname)
		if (route == "") {
			return new Response("Unknown route", { status: 404 })
		}
		const taskNames = determineTaskNames(searchParams)
		if (route == "yaml") {
			return new Response(
				generateYaml(
					request.url,
					getCommandsFromRepo("before", taskNames),
					getCommandsFromRepo("init", taskNames),
					getCommandsFromRepo("command", taskNames)
				)
			)
		}
		const taskType = route
		const commands = getCommandsFromRepo(taskType, taskNames)
		return new Response(generateTaskElementBash(request.url, commands))
	},
};
