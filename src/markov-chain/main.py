# !/usr/bin/python
# -*- coding: utf-8 -*-

import sys
import string
from markov_chain import MarkovChain, extensions

def main():
    """
    Executes a MarkovChain for text generation.

    Then it will be wait for user input.
    If length of user input less than `window` parameter of the chain,
    then random text will be generated, else last 3 words of the input will be
    taken as a start of generated text.
    If you want break the process, then enter `48598ee283437e810f2f0eb1cf66e217`.
    """
    chain = MarkovChain()
    # path relative to command line that executes that script.
    chain.chain = extensions.file.json.read("./src/markov-chain/generated-chains/ru/my-favorites-3-window.json")

    while True:
        start_text = input()

        if (start_text == "48598ee283437e810f2f0eb1cf66e217"):
            break

        start_text = handle_input_text(start_text)

        if (start_text):
            print(chain.generate(start=start_text))
        else:
            print(chain.generate())

def handle_input_text(text, window):
    """
    Handles input to be acceptable for generation.

    Parameters:
        - text: str
            The text for handle.

        - window: int
            How many windows in the chain.
            Should be same as a `window` parameter of
            the chain, else generation will not work.

    Returns:
        `None` if text is not acceptable else `str`.
        len(string) == window.
        The returned string will contain `window` count
        words from the end of the text.

    Example:
        Input: handle_input_text("A big white fox!?.", 3)
        Output: "big white fox"
    """
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

    text = text.split()

    if (len(text) < window):
        return None
    else:
        # get `window` number of words from the end of the text.
        return " ".join(text[len(text) - window:])

if __name__ == "__main__":
    main()
