python := python3.5
activate := source .env/bin/activate

api_dir := api

gulp := gulp
gulp_target := 

pyc_source = $(exec find . -type f -name "*.pyc")

.PHONY: run kill

all: .env

.env:
	virtualenv % -p $(python)

.installpackages.ts: .env
	$(activate) && \
	pip install -r requirements.txt && \
	npm install && \
	touch $@

$(activate): .installpackages.ts

run: $(SRC) $(activate)
	$(activate) && \
	$(gulp) $(gulp_target) && \
	$(python) $(api_dir)/run.py

kill:
	kill -9 `lsof -ti :5000`

clean:
	rm -rf ui/dist && \
	rm -rf $(pyc_source) && \
	rm .*.ts
