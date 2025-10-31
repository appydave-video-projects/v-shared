alias c='code'                                          # Open in VSCode
alias o="open ."                                        # Open the current directory in Finder
alias windsurf='open -a "Windsurf" "$PWD"'              # Open the current directory in Windsurf
alias ob='open -a "Obsidian" .'

alias cdiff='code --diff'                               # Open VSCode Diff <file1> <file2>
alias f="find ."                                        # Find all files in current directory
alias l="ls -lsah"                                      # List files
alias lrecurse="ls -lrt -d -1 "$PWD"/**/{*,.*} | sort"  # Reqursively List files
alias pwdc="pwd | pbcopy"                               # Copy path to clipboard
alias lclip="ls_filenames | pbcopy"                      # File names to clipboard
alias path="echo -e ${PATH//:/\\n}"
alias now='date +"%T"'

# alias drawio="/Applications/draw.io.app/Contents/MacOS/draw.io"
# alias df="diff -rq"                                     # Diff two folders (quiet, files only)
# alias dfc="diff -r"                                     # Diff two folders (with content changes)
# alias clc="echo !! | pbcopy"                            # Copy last command to clipboard
alias mys='cd "/Users/davidcruwys/Library/Application Support/Code/User/snippets" && c .'  # My Snippets

alias x="exit"
alias rl="exec zsh"

function ls_filenames() {
  for n in *; do printf '%s\n' "$n"; done
}

alias recordmic='ffmpeg -f avfoundation -i ":0" out.wav'

transcribe() {
  input="$1"
  base="${input##*/}"            # strip any path
  base_no_ext="${base%.*}"       # remove extension
  ~/.pyenv/versions/3.11.12/bin/python -m whisper "$input" --model medium --language en --output_format txt --output_dir .
  mv "${base_no_ext}.txt" "${input}.txt"
}

# alias transcribe='whisper.cpp --model medium.en --file out.wav'
# alias snap='screencapture -x ~/Desktop/snap_$(date +%s).png'

killquick() {
  if [ -z "$1" ]; then
    echo "⚠️  Usage: k9 <PID>"
  else
    kill -9 "$1" && echo "💀 Sent SIGKILL to PID $1"
  fi
}

alias k9="killquick"


# alias km="asdf shell ruby 2.7.6 && KLUE_LOCAL_GEMS=false && KLUE_DEBUG=false && k_manager $1"
# alias km2="asdf shell ruby 2.7.6 && KLUE_LOCAL_GEMS=true && KLUE_DEBUG=true && /Users/davidcruwys/dev/kgems/k_manager/exe/k_manager $1"
# alias kw="asdf shell ruby 2.7.6 && KLUE_LOCAL_GEMS=true && KLUE_DEBUG=true && /Users/davidcruwys/dev/kgems/k_manager/exe/k_manager watch"
# alias kwk="asdf shell ruby 2.7.6 && KLUE_LOCAL_GEMS=true && KLUE_DEBUG=true && /Users/davidcruwys/dev/kgems/k_manager/exe/k_manager watch .klue"

alias km="asdf shell ruby 2.7.6 && KLUE_LOCAL_GEMS=false && KLUE_DEBUG=false && k_manager $1"
alias km2="asdf shell ruby 2.7.6 && KLUE_LOCAL_GEMS=true && KLUE_DEBUG=true && /Users/davidcruwys/dev/kgems/k_manager/exe/k_manager $1"
alias kw='cd /Users/davidcruwys/dev/kgems/k_manager && KLUE_LOCAL_GEMS=true KLUE_DEBUG=true bundle exec ./exe/k_manager watch'
alias kwk="asdf shell ruby 2.7.6 && KLUE_LOCAL_GEMS=true && KLUE_DEBUG=true && /Users/davidcruwys/dev/kgems/k_manager/exe/k_manager watch .klue"

# Chrome debug function with configurable port
# Usage:
#   chrome-debug          # Uses default port 9222
#   chrome-debug 9322     # Uses port 9322 (for AI development)
#   chrome-debug 9223     # Uses port 9223 (custom port)
chrome-debug() {
    local port=${1:-9222}
    echo "Starting Chrome debug on port $port"
    /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
        --user-data-dir=/tmp/chrome_debug_$port \
        --remote-debugging-port=$port &
    echo "Chrome debug started on port $port"
    echo "Access debug interface at: http://localhost:$port"
}
