VENV_DIR = venv
REQUIREMENTS = requirements.txt
SERVICE_SCRIPT = Database/setupService.sh
REMOVE_SERVICE_SCRIPT = Database/removeService.sh

all: pymodules service run

$(VENV_DIR):
	python3 -m venv $(VENV_DIR)

pymodules: $(VENV_DIR) $(REQUIREMENTS)
	$(VENV_DIR)/bin/python3 $(VENV_DIR)/lib/python3.11/site-packages/pip/__pip-runner__.py install -r $(REQUIREMENTS)

service: $(remove_service_script) $(service_script)
	bash $(SERVICE_SCRIPT)

run:
	$(VENV_DIR)/bin/python3 main.py

clean: $(REMOVE_SERVICE_SCRIPT)
	bash $(REMOVE_SERVICE_SCRIPT)

fclean: clean
	rm -rf $(VENV_DIR)

re: clean all

.PHONY: all pymodules service run clean fclean
