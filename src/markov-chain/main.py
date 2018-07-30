import sys
from markov_chain import MarkovChain, extensions


def main():
    chain = MarkovChain()
    chain.chain = extensions.file.json.read("./markov-chain/generated-chains/ru/my-favorites-3-window.json")

    print("Ready")

    while True:
        arg = input()
        print(chain.generate())


if __name__ == "__main__":
    main()
