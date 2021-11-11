export EDITOR := 'nvim'

alias f := fmt
alias r := run

default:
	just --list

run:
	yarn start

fmt:
	prettier --write .
