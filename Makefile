# ローカル開発環境用ビルド
.PHONY: ollama/stop
ollama/stop:
	@echo 'executing >> osascript -e "tell app \"Ollama\" to quit" >>'
	osascript -e 'tell app "Ollama" to quit'

.PHONY: ollama/start
ollama/start:
	@echo 'executing >> ollama serve >>'
	ollama serve

.PHONY: supabase/local-start-with-env
supabase/local-start-with-env:
	supabase functions serve --env-file supabase/functions/.env
