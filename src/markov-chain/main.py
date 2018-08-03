import sys
from markov_chain import MarkovChain, extensions

def main():
    chain = MarkovChain()
    chain.chain = extensions.file.json.read("./src/markov-chain/generated-chains/ru/my-favorites-3-window.json")

    while True:
        arg = input()

        if (arg):
            print(chain.generate(start=arg))
        else:
            print(chain.generate())

if __name__ == "__main__":
    main()
