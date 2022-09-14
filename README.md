
# gitpod-config

I got bored of adding and maintaining similar Gitpod configurations over and over again to different repositories.

This repository contains a collection of `.gitpod.yml` task definitions that I have found to be useful and code for a Cloudflare Worker serving bundles of these tasks.

There is a version of the generator hosted at https://gitpod.5ha.re. Feel free to host your own.
## Usage

There is a collection of task definitions in the [tasks folder](https://github.com/JonMerlevede/gitpod-config/tree/main/tasks).

Execute any combination of these tasks by adding the following to your `.gitpod.yml` file (adapt `TASKS` to change your bundle definition):
```
tasks:
  - name: Gitpod installer
    before: TASKS="browser+awscli"; eval "$(curl -s https://gitpod.5ha.re/before?tasks=$TASKS)"
    init: eval "$(curl -s https://gitpod.5ha.re/init?tasks=$TASKS)"
    command: eval "$(curl -s https://gitpod.5ha.re/command?tasks=$TASKS)"
```

Evaluating remote code like this can be a security risk. You can alternatively generate a combined task bundle from the link below and copy+paste this to your `.gitpod.yml`:

> https://gitpod.5ha.re/yaml?tasks=browser+exit
