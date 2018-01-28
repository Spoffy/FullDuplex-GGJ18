const MESSAGE_HARD_UPPER_BOUND = 1900;

function textToChunks(text: string, chunkSize: number = MESSAGE_HARD_UPPER_BOUND): Array<string> {
    let toSplit: string = text;
    let output = [];

    do {
        output.push(toSplit.substr(0, chunkSize));
        toSplit = toSplit.substr(chunkSize);
    } while(toSplit.length > chunkSize);

    return output;
}

export function packetizeAndSend(content: string, sendFunction: (message: string) => any, sendThreshold: number = 1500) {
    let toSend = content.split("\n").reverse();
    let sendBuffer = [];
    let bufferSize = 0;

    while(toSend.length > 0) {
        let next = toSend.pop();
        sendBuffer.push(next);
        bufferSize += next.length;

        if(bufferSize > MESSAGE_HARD_UPPER_BOUND) {
            let item = sendBuffer.pop();
            if(item.length > MESSAGE_HARD_UPPER_BOUND) {
                let itemChunks = textToChunks(item);
                toSend = toSend.concat(itemChunks.reverse());
            } else {
                toSend.push(item);
            }

            sendFunction(sendBuffer.join("\n"));
            sendBuffer = [""];
            bufferSize = 0;
        }
    }

    if(sendBuffer.length > 0) {
        sendFunction(sendBuffer.join("\n"));
    }
}