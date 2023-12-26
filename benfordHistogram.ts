import { Transform } from "stream";
import fs from "fs";

export function Benfords(stream: fs.ReadStream) {
  const dictionary = {} as Record<string, number>;
  stream.pipe(removeExtraSpaces).pipe(BenfordHistogram(dictionary));
  stream.on("end", () => {
    const counts = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
    } as Record<string, number>;
    Object.values(dictionary).forEach((value) => {
      const firstDigit = Number(value.toString()[0]);
      if (counts[firstDigit]) {
        counts[firstDigit]++;
      } else {
        counts[firstDigit] = 1;
      }
    });
    console.log("Distribution of first digits:");
    const max = Math.max(...Object.values(counts));
    const total = Object.values(counts).reduce((a, b) => a + b);
    console.log(
      Object.entries(counts)
        .map(
          ([key, value]) =>
            `${key}: ${"-".repeat(getScaledDashes(max, value))} (${(
              100 *
              (value / total)
            ).toFixed(2)}%)`
        )
        .join("\n")
    );
  });
}

const removeExtraSpaces = new Transform({
  transform(chunk, _encoding, callback) {
    // remove spaces larger than 1
    const data = chunk.toString().replace(/\s+/g, " ");
    this.push(data);
    callback();
  },
});

function BenfordHistogram(dictionary: Record<string, number>): Transform {
  return new Transform({
    transform(chunk, _encoding, callback) {
      const data = (chunk.toString() as string).split(" ");
      data.forEach((word) => {
        if (dictionary[word]) {
          dictionary[word]++;
        } else {
          dictionary[word] = 1;
        }
      });
      callback();
    },
  });
}

function getScaledDashes(max: number, val: number): number {
  const dashes = 50;
  const ratio = val / max;
  return Math.floor(ratio * dashes);
}
