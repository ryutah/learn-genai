.PHONY: help
help: ## Prints help for targets with comments
	@cat $(MAKEFILE_LIST) | grep -E '^[\/a-zA-Z_-]+:.*?## .*$$' | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: mcp/inspector
mcp/inspector: ## Run the MCP Inspector
	@echo "Running MCP Inspector..."
	@npx @modelcontextprotocol/inspector
