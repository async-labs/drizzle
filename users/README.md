### Setup
* Run `setup.sh` (`./setup.sh`)

### Run

We need to run three app (main meteor and 2 simple static file server) in order to
simulate real life environment.

* `meteor --port 8051` (inside `main` folder)
* `./start.sh` (inside `publisher` and `widget` folder)

If you work on widget section you should also need to run `gulp` build task.

* `gulp` (inside widget folder)

> If you face with `gulp command not found` error, install it by `npm install -g gulp`
command.
