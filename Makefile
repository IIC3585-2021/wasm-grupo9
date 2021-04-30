EMCC=emcc

all: tsp.c
	$(EMCC) -O3 -s WASM=1 -o glue.js -s EXTRA_EXPORTED_RUNTIME_METHODS="['getValue', 'setValue']" -s EXPORTED_FUNCTIONS="['_calloc', '_mincost']" -s EXPORT_ES6=1 -s MODULARIZE=1 tsp.c
