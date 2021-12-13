export EDITOR := 'nvim'

alias f := fmt
alias r := run

default:
	just --list

run:
	yarn start

fmt:
	prettier --write .

toc path:
  gh-md-toc       \
    --insert      \
    --no-backup   \
    --hide-footer \
  {{ path }}

sloc:
	@cat src/**/** | wc -l
