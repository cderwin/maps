# Installation

To compile the javascript, you'll need node, bower, and gulp.  After that, to install:

```bash
git clone https://github.com/cderwin/maps
cd maps
npm install
bower install
```

and to compile,

```bash
gulp
```

Now the compiled assets are located in `ui/dist`.

To install the backend, you'll need Python 3.5 and virtualenv.  Then you can just run `make`.

# Running

To run a development server, you can do `make run`.  Now you can view the map at `http://localhost:5000`.  Note this compiles the js, so you'll need to follow the js compilation steps.

# License

This project is covered by the MIT License.  For more information see license.txt.
