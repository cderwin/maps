python := python3.5
activate := source .env/bin/activate

.PHONY: run kill

all: .env

.env:
	virtualenv % -p $(python)

$(activate): .env

run: $(SRC)
	$(activate) && \
	$(python) maps/run.py

kill:
	kill -9 `lsof -ti :5000`
