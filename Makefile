python := python3.5
activate := source .env/bin/activate

.env:
	virtualenv % -p $(python)

$(activate): .env
