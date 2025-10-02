const fs = require('fs');
const { Transform } = require('stream');

function processData(inputFilePath, outputFilePath) {
  // Create a readable stream from input file
  const readStream = fs.createReadStream(inputFilePath, { encoding: 'utf8' });

  // Create a writable stream to output file
  const writeStream = fs.createWriteStream(outputFilePath, { encoding: 'utf8' });

  // Define a transform stream to process the data
  const transformStream = new Transform({
    transform(chunk, encoding, callback) {
      try {
        // Example processing: convert chunk to uppercase
        const processedChunk = chunk.toString().toUpperCase();

        // Push processed data to the next stage
        this.push(processedChunk);
        callback();
      } catch (err) {
        callback(err);
      }
    }
  });

  // Pipe the streams: read -> transform -> write
  readStream
    .pipe(transformStream)
    .pipe(writeStream)
    .on('finish', () => {
      console.log(`Processing complete. Output written to ${outputFilePath}`);
    })
    .on('error', (err) => {
      console.error('Error during processing:', err.message);
    });
}

processData('input.txt', 'output.txt');
