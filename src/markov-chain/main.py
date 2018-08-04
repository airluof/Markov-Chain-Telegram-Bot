# !/usr/bin/python
# -*- coding: utf-8 -*-

import sys
import string
from markov_chain import MarkovChain, extensions

def main():
    chain = MarkovChain()
    chain.chain = extensions.file.json.read("./src/markov-chain/generated-chains/ru/my-favorites-3-window.json")

    while True:
        start_text = input()
        start_text = handle_input_text(start_text)

        if (start_text):
            print(chain.generate(start=start_text))
        else:
            print(chain.generate())

def handle_input_text(text):
    text = text.strip()

    if not text:
        return None

    # we don't want any punctuation symbols at the end
    # of the text because we looking for the start
    # of a sentence, not the end.
    # `text.translate(None, string.punctuation)` shouldn't used here
    # because it removes all punctuation symbols.
    while (text[-1] in string.punctuation):
        text = text[:-1]

    # should be same as a `window` parameter of the chain,
    # else generation will not work.
    window = 3
    text = text.split()

    if (len(text) < window):
        return None
    else:
        # get `window` number of words from the end of the text.
        return " ".join(text[len(text) - window:])

if __name__ == "__main__":
    main()
