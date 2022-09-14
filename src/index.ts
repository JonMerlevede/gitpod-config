import allTasks from "./tasks.json"

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

function buildScript(actions: Array<[string, string]>): string {
	return `#!/bin/bash

${actions.map(([task, taskContent]) => `# executing ${task}
${taskContent}
`
	).join("")}
	`
}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		//return new Response(JSON.stringify(actions))
		const { pathname, searchParams } = new URL(request.url);
		let taskType = ""
		if (pathname.startsWith("/init")) {
			taskType = "init"
		} else if (pathname.startsWith("/command")) {
			taskType = "command"
		} else if (pathname.startsWith("/before")) {
			taskType = "before"
		}
		if (taskType == "") {
			return new Response("Unknown action", { status: 404 })
		}
		const taskNames = ["base"].concat(searchParams.get("tasks")?.split(" ") || [])
		// return new Response(JSON.stringify(taskNames))

		const tasks: [string, string][] = []
		taskNames.forEach((taskName) => {
			if ((taskName in allTasks) && (taskType in (<any>allTasks)[taskName])) {
				tasks.push([taskName, <string>((<any>allTasks)[taskName][taskType])])
			}
		})
		// const tasks: [string, string][] = taskNames.map((name) => [name, ((allTasks as any)[name] || {})[taskType] || []])
		return new Response(buildScript(tasks))
	},
};
