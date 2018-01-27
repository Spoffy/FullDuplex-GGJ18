export class NATOAlphabetNameGenerator {
    static ALPHABET = [
        "Alpha",
        "Bravo",
        "Charlie",
        "Delta",
        "Echo",
        "Foxtrot",
        "Golf",
        "Hotel",
        "Indigo",
        "Juliet",
        "Kilo",
        "Lima",
        "Mike",
        "November",
        "Oscar",
        "Papa",
        "Quebec",
        "Romeo",
        "Sierra",
        "Tango",
        "Uniform",
        "Victor",
        "Whiskey",
        "Xray",
        "Yankee",
        "Zulu"
    ];

    private counter = 0;
    private prefix = "";

    randomLetter(): string {
        return NATOAlphabetNameGenerator.ALPHABET[Math.floor(Math.random() * NATOAlphabetNameGenerator.ALPHABET.length)]
    }

    next(): string {
        let num = Math.trunc(Math.random() * 100);
        let name = this.prefix + NATOAlphabetNameGenerator.ALPHABET[this.counter] + "-" + num
        this.counter++;
        if(this.counter == NATOAlphabetNameGenerator.ALPHABET.length) {
            this.prefix += this.randomLetter() + "-";
            this.counter = 0;
        }
        return name;
    }
}