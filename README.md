# Social Adonis

An exploratory hobby project that serves, to me, as an introduction to the combo of AdonisJS v6 + React via Inertia development conventions. The original product premise is to be a social media platform, with the intent of growing it organically, as time fits.

### Project run

1. Create a `.env` file, based of the `.env.example`, and customize the values as fitting for your local development environment.

```bash
$ cp .env.example .env
```

2. Install dependencies.

```bash
$ yarn
```

3. Run development.

```bash
$ yarn dev
```

### Implemented main features

- Basic authentication;
- User feed;
- User posting CRUD;

### Future roadmap

Have planned a general gist on what I would like to shape it in the near future, publically visible in [board](https://github.com/users/mariadriana-deemaze/projects/2) here.

### Commit

The project is following the general guidance of commitizen rules, customizly adapted as per defined in the `cz.json` file.
To proceed with a project contribution, make sure to have globally enabled in your machine the [commitizen-cli](https://www.npmjs.com/package/commitizen).

Then simply type in your terminal the following command, and follow along the configured prompts.

```bash
$ cz c
```
