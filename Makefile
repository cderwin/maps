python := python3.5
activate := source .env/bin/activate

api_dir := api

gulp := gulp
gulp_target := 

.PHONY: run kill

all: .env

.env:
	virtualenv % -p $(python)

$(activate): .env

run: $(SRC)
	$(activate) && \
	$(gulp) $(gulp_target) && \
	$(python) $(api_dir)/run.py

kill:
	kill -9 `lsof -ti :5000`
