gitpod-config
=============

Copying similar Gitpod configurations repeatedly to all your projects' repositories gets old quickly. Many copies are also hard to maintain. This project attempts to address or at least centralize my Gitpod configuration woes.

Most important is the collection of task definitions that I found helpful. There is also code for a web application combining tasks into task bundles. The bundler can expose bundles either as Bash scripts that can be evaluated directly or as Gitpod YAML configuration.

I host the bundler at https://gitpod.5ha.re. Feel free to use it; you can also easily host your own (see below).


Tasks
------------

Find the collection of tasks in the [tasks folder](https://github.com/JonMerlevede/gitpod-config/tree/main/tasks).
The name of the YAML file corresponds to the task's name when using the bundler.


Bundler
------------

Execute task bundles by adding the following to your `.gitpod.yml` file:
```
tasks:
  - name: Gitpod installer
    before: TASKS="browser+awscli"; eval "$(curl -s https://gitpod.5ha.re/before?tasks=$TASKS)"
    init: eval "$(curl -s https://gitpod.5ha.re/init?tasks=$TASKS)"
    command: eval "$(curl -s https://gitpod.5ha.re/command?tasks=$TASKS)"
```
`TASKS` defines the set of tasks to include in the bundle; `+` characters must separate task names.

Alternatively, if you prefer not to evaluate remote code like this, generate a combined task bundle:
```
wget https://gitpod.5ha.re/yaml?tasks=browser+exit -O .gitpod.yml
```

In the likely case that you have an existing `.gitpod.yml` file, you must manually merge the output of the `/yaml` endpoint with your existing configuration:

> https://gitpod.5ha.re/yaml?tasks=browser+exit


Notes
------------

* Bundler code targets deployment on [Cloudflare Workers](https://workers.cloudflare.com/).
* Tasks should work when using Gitpod's default `workspace-full` image. They might not work with other images.
* I do not usually write TypeScript or JavaScript code and never used Workers before; the bundler code is not particularly pretty.
* This scratches my Gitpod configuration itch; do not expect me to improve or maintain this (I might, though).
* Gitpod can run custom images. I avoid this. Building custom images using a `Dockerfile` on Gitpod can take ages and can time out. Workspaces with custom images also take much longer to start.

To "self-host" a Worker:

* Install the Cloudflare CLI Wrangler (version 2+): `npm install -g wrangler`
* Initialize the project: `npm install`
* Log in your Wrangler CLI: `wrangler login`
* Run and test the Worker locally: `npm run start`
* Deploy your Worker: `npm run deploy`
